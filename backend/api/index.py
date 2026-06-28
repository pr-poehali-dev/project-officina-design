"""
Главный API Paterno: авторизация, CRUD для всех сущностей сайта.
Эндпоинты:
  POST /login
  GET/POST/PUT/DELETE /products
  GET/POST/PUT/DELETE /projects
  GET/POST/PUT/DELETE /articles
  GET/POST/PUT/DELETE /team
  GET/POST /content
"""
import json
import os
import hashlib
import hmac
import base64
import time
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
SECRET = 'paterno_admin_jwt_secret_2025'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)

def ok(data, status=200):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, status=400):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

# --- simple JWT (HMAC-SHA256) ---
def make_token(username: str) -> str:
    payload = base64.b64encode(json.dumps({'u': username, 'exp': int(time.time()) + 86400 * 30}).encode()).decode()
    sig = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"

def verify_token(token: str) -> str | None:
    try:
        payload, sig = token.rsplit('.', 1)
        expected = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(base64.b64decode(payload))
        if data['exp'] < time.time():
            return None
        return data['u']
    except Exception:
        return None

def get_auth(event) -> str | None:
    h = event.get('headers', {})
    raw = h.get('X-Authorization') or h.get('Authorization') or ''
    token = raw.replace('Bearer ', '').strip()
    return verify_token(token) if token else None

def b(event):
    body = event.get('body') or '{}'
    if event.get('isBase64Encoded'):
        body = base64.b64decode(body).decode()
    return json.loads(body) if body else {}

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    q = event.get('queryStringParameters') or {}
    # Платформа передаёт путь в event['path'], иногда с префиксом function-id
    # /abc123/content → /content
    raw_path = event.get('path', '/')
    path = '/' + raw_path.rsplit('/', 1)[-1] if raw_path.count('/') > 1 else raw_path

    # ── POST /login ──────────────────────────────────────────────────
    if path.endswith('/login') and method == 'POST':
        data = b(event)
        username = data.get('username', '')
        password = data.get('password', '')
        db = get_db()
        cur = db.cursor()
        cur.execute(f'SELECT password_hash FROM {SCHEMA}.admin_users WHERE username = %s', (username,))
        row = cur.fetchone()
        db.close()
        if not row:
            return err('Неверный логин или пароль', 401)
        import bcrypt
        if not bcrypt.checkpw(password.encode(), row['password_hash'].encode()):
            return err('Неверный логин или пароль', 401)
        return ok({'token': make_token(username), 'username': username})

    # ── GET /content ─────────────────────────────────────────────────
    if path.endswith('/content') and method == 'GET':
        db = get_db()
        cur = db.cursor()
        cur.execute(f'SELECT key, value FROM {SCHEMA}.site_content')
        rows = cur.fetchall()
        db.close()
        return ok({r['key']: r['value'] for r in rows})

    # ── POST /content (admin) ────────────────────────────────────────
    if path.endswith('/content') and method == 'POST':
        if not get_auth(event):
            return err('Unauthorized', 401)
        updates = b(event)
        db = get_db()
        cur = db.cursor()
        for key, value in updates.items():
            cur.execute(
                f'INSERT INTO {SCHEMA}.site_content (key, value) VALUES (%s, %s) '
                f'ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
                (key, str(value))
            )
        db.commit()
        db.close()
        return ok({'ok': True})

    # ── /products ────────────────────────────────────────────────────
    if '/products' in path:
        db = get_db()
        cur = db.cursor()
        if method == 'GET':
            admin = get_auth(event)
            if admin:
                cur.execute(f'SELECT * FROM {SCHEMA}.products ORDER BY id')
            else:
                cur.execute(f'SELECT * FROM {SCHEMA}.products WHERE visible = TRUE ORDER BY id')
            rows = cur.fetchall()
            db.close()
            return ok(list(rows))
        if not get_auth(event):
            db.close(); return err('Unauthorized', 401)
        if method == 'POST':
            d = b(event)
            cur.execute(
                f'INSERT INTO {SCHEMA}.products (article, name, price, category, car, is_new, image_url, visible) '
                f'VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *',
                (d.get('article',''), d.get('name',''), int(d.get('price',0)),
                 d.get('category',''), d.get('car',''), bool(d.get('is_new',False)),
                 d.get('image_url',''), bool(d.get('visible', True)))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row), 201)
        if method == 'PUT':
            pid = q.get('id') or path.split('/')[-1]
            d = b(event)
            cur.execute(
                f'UPDATE {SCHEMA}.products SET article=%s, name=%s, price=%s, category=%s, car=%s, '
                f'is_new=%s, image_url=%s, visible=%s WHERE id=%s RETURNING *',
                (d.get('article',''), d.get('name',''), int(d.get('price',0)),
                 d.get('category',''), d.get('car',''), bool(d.get('is_new',False)),
                 d.get('image_url',''), bool(d.get('visible',True)), int(pid))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row)) if row else err('Not found', 404)
        if method == 'DELETE':
            pid = q.get('id') or path.split('/')[-1]
            cur.execute(f'DELETE FROM {SCHEMA}.products WHERE id=%s', (int(pid),))
            db.commit(); db.close()
            return ok({'ok': True})

    # ── /projects ────────────────────────────────────────────────────
    if '/projects' in path:
        db = get_db()
        cur = db.cursor()
        if method == 'GET':
            admin = get_auth(event)
            if admin:
                cur.execute(f'SELECT * FROM {SCHEMA}.design_projects ORDER BY id')
            else:
                cur.execute(f'SELECT * FROM {SCHEMA}.design_projects WHERE visible = TRUE ORDER BY id')
            rows = cur.fetchall()
            db.close()
            return ok(list(rows))
        if not get_auth(event):
            db.close(); return err('Unauthorized', 401)
        if method == 'POST':
            d = b(event)
            cur.execute(
                f'INSERT INTO {SCHEMA}.design_projects (name, car, status, description, price, discount, image_url, tall, parts, visible) '
                f'VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *',
                (d.get('name',''), d.get('car',''), d.get('status','Концепт'), d.get('description',''),
                 int(d.get('price',0)), int(d.get('discount',0)), d.get('image_url',''),
                 bool(d.get('tall',False)), d.get('parts',[]), bool(d.get('visible',True)))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row), 201)
        if method == 'PUT':
            pid = q.get('id') or path.split('/')[-1]
            d = b(event)
            cur.execute(
                f'UPDATE {SCHEMA}.design_projects SET name=%s, car=%s, status=%s, description=%s, price=%s, '
                f'discount=%s, image_url=%s, tall=%s, parts=%s, visible=%s WHERE id=%s RETURNING *',
                (d.get('name',''), d.get('car',''), d.get('status','Концепт'), d.get('description',''),
                 int(d.get('price',0)), int(d.get('discount',0)), d.get('image_url',''),
                 bool(d.get('tall',False)), d.get('parts',[]), bool(d.get('visible',True)), int(pid))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row)) if row else err('Not found', 404)
        if method == 'DELETE':
            pid = q.get('id') or path.split('/')[-1]
            cur.execute(f'DELETE FROM {SCHEMA}.design_projects WHERE id=%s', (int(pid),))
            db.commit(); db.close()
            return ok({'ok': True})

    # ── /articles ────────────────────────────────────────────────────
    if '/articles' in path:
        db = get_db()
        cur = db.cursor()
        if method == 'GET':
            admin = get_auth(event)
            if admin:
                cur.execute(f'SELECT * FROM {SCHEMA}.articles ORDER BY id DESC')
            else:
                cur.execute(f'SELECT * FROM {SCHEMA}.articles WHERE visible=TRUE ORDER BY id DESC')
            rows = cur.fetchall()
            db.close()
            return ok(list(rows))
        if not get_auth(event):
            db.close(); return err('Unauthorized', 401)
        if method == 'POST':
            d = b(event)
            cur.execute(
                f'INSERT INTO {SCHEMA}.articles (pub_date, title, tags, preview, visible) VALUES (%s,%s,%s,%s,%s) RETURNING *',
                (d.get('pub_date',''), d.get('title',''), d.get('tags',[]), d.get('preview',''), bool(d.get('visible',True)))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row), 201)
        if method == 'PUT':
            pid = q.get('id') or path.split('/')[-1]
            d = b(event)
            cur.execute(
                f'UPDATE {SCHEMA}.articles SET pub_date=%s, title=%s, tags=%s, preview=%s, visible=%s WHERE id=%s RETURNING *',
                (d.get('pub_date',''), d.get('title',''), d.get('tags',[]), d.get('preview',''), bool(d.get('visible',True)), int(pid))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row)) if row else err('Not found', 404)
        if method == 'DELETE':
            pid = q.get('id') or path.split('/')[-1]
            cur.execute(f'DELETE FROM {SCHEMA}.articles WHERE id=%s', (int(pid),))
            db.commit(); db.close()
            return ok({'ok': True})

    # ── /team ────────────────────────────────────────────────────────
    if '/team' in path:
        db = get_db()
        cur = db.cursor()
        if method == 'GET':
            cur.execute(f'SELECT * FROM {SCHEMA}.team_members WHERE visible=TRUE ORDER BY sort_order')
            rows = cur.fetchall()
            db.close()
            return ok(list(rows))
        if not get_auth(event):
            db.close(); return err('Unauthorized', 401)
        if method == 'POST':
            d = b(event)
            cur.execute(
                f'INSERT INTO {SCHEMA}.team_members (name, role, note, sort_order, visible) VALUES (%s,%s,%s,%s,%s) RETURNING *',
                (d.get('name',''), d.get('role',''), d.get('note',''), int(d.get('sort_order',0)), bool(d.get('visible',True)))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row), 201)
        if method == 'PUT':
            pid = q.get('id') or path.split('/')[-1]
            d = b(event)
            cur.execute(
                f'UPDATE {SCHEMA}.team_members SET name=%s, role=%s, note=%s, sort_order=%s, visible=%s WHERE id=%s RETURNING *',
                (d.get('name',''), d.get('role',''), d.get('note',''), int(d.get('sort_order',0)), bool(d.get('visible',True)), int(pid))
            )
            row = cur.fetchone(); db.commit(); db.close()
            return ok(dict(row)) if row else err('Not found', 404)
        if method == 'DELETE':
            pid = q.get('id') or path.split('/')[-1]
            cur.execute(f'DELETE FROM {SCHEMA}.team_members WHERE id=%s', (int(pid),))
            db.commit(); db.close()
            return ok({'ok': True})

    return err('Not found', 404)