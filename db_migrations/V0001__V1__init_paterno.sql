
-- Admin users
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin: login=admin, password=paterno2025
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$12$KIX4VCa3JkgVPgvbJpI8B.7KMPd0mLj3nXqaYNPqZJ4U1qXfO7JMm');

-- Site content (key-value for all editable text/images)
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_content (key, value) VALUES
  ('brand_name', 'Paterno'),
  ('brand_tagline', 'Итальянская душа говорит на русском языке'),
  ('hero_subtitle', 'Два направления — Officina и Design. Производство и ресейл изделий, а также самостоятельные концептуальные проекты.'),
  ('officina_title', 'Officina'),
  ('officina_eyebrow', 'Производство и ресейл'),
  ('officina_desc', 'Технические изделия и тюнинг собственного производства. Каждая деталь — характер.'),
  ('officina_image', 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg'),
  ('design_title', 'Design'),
  ('design_eyebrow', 'Авторские проекты'),
  ('design_desc', 'Концептуальные проекты для конкретных автомобилей. Готовые комплекты или отдельные детали.'),
  ('design_image', 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/64a1bde8-7cbe-43b6-b460-d786185e4b24.jpg'),
  ('about_title', 'О Paterno'),
  ('about_philosophy', 'PATERNO — это пространство, где итальянская традиция встречает русский характер. Мы убеждены: автомобиль — это продолжение личности. Каждая деталь, которую мы создаём, несёт в себе намерение.'),
  ('about_philosophy_2', 'Мы не производим тираж. Мы создаём изделия. Разница между этим — в том, что вы чувствуете, когда кладёте руку на руль.'),
  ('about_image', 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/325ab3ab-f8a5-49a5-b385-77bc145de420.jpg'),
  ('contact_email', 'hello@paterno-atelier.ru'),
  ('contact_phone', '+7 (999) 000-00-00'),
  ('contact_address', 'Москва, Малая Полянка, 2'),
  ('contact_telegram', '@paterno_atelier'),
  ('stat_founded', '2019'),
  ('stat_projects', '120+'),
  ('stat_countries', '4'),
  ('stat_handmade', '100%');

-- Products (Officina catalog)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  article TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  car TEXT NOT NULL,
  is_new BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (article, name, price, category, car, is_new, image_url) VALUES
  ('OF-001', 'Рукоятка КПП Sport', 4800, 'Ручки', 'Universal', TRUE, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg'),
  ('OF-002', 'Накладка приборной панели', 12400, 'Приборки', 'BMW', FALSE, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg'),
  ('OF-003', 'Крепление антенны медь', 2200, 'Крепления', 'Audi', TRUE, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg'),
  ('OF-004', 'Рукоятка ручника кожа', 3600, 'Ручки', 'Mercedes', FALSE, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg'),
  ('OF-005', 'Панель управления климатом', 18900, 'Приборки', 'BMW', FALSE, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg'),
  ('OF-006', 'Кронштейн зеркала медь', 5100, 'Крепления', 'Universal', TRUE, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/0665b630-36fe-495d-b4d8-06c0a0a747cb.jpg');

-- Design projects
CREATE TABLE design_projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  car TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Концепт',
  description TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  image_url TEXT,
  tall BOOLEAN DEFAULT FALSE,
  parts TEXT[] DEFAULT '{}',
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO design_projects (name, car, status, description, price, discount, image_url, tall, parts) VALUES
  ('Cabernet Interior', 'BMW E46', 'В продаже', 'Полный интерьер в духе итальянского ателье: кожа каберне, медные вставки, авторская приборная панель.', 284000, 12, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg', TRUE, ARRAY['Рукоятка КПП Sport', 'Накладка приборной панели', 'Кронштейн зеркала медь']),
  ('Anthracite Edition', 'Audi A4 B8', 'Скоро', 'Сдержанный антрацит с золотыми строчками. Минимализм как форма уважения.', 196000, 0, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg', FALSE, ARRAY['Рукоятка ручника кожа', 'Панель управления климатом']),
  ('Verde Corsa', 'Mercedes C-Class W204', 'Концепт', 'British Racing Green снаружи — бежевая кожа внутри. Классика в новом прочтении.', 0, 0, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg', FALSE, ARRAY[]::TEXT[]),
  ('Bianco Milano', 'BMW E39', 'Архив', 'Белая кожа с серебряными вставками. Проект завершён, доступен для изучения.', 0, 0, 'https://cdn.poehali.dev/projects/08d0c2a2-be6a-4066-897a-f52a0c49d18b/files/9c9e9df2-d507-4e9f-be6c-213430871a34.jpg', TRUE, ARRAY[]::TEXT[]);

-- Blog articles
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  pub_date TEXT NOT NULL,
  title TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  preview TEXT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO articles (pub_date, title, tags, preview) VALUES
  ('15 июня 2025', 'Медь как акцент: почему мы выбрали этот металл', ARRAY['Дизайн', 'Материалы'], 'Медь — не просто декоративный элемент. Это температура, тактильность и характер…'),
  ('3 мая 2025', 'Итальянская школа дизайна: что Россия взяла у Милана', ARRAY['История', 'Философия'], 'Каноны карозерии до сих пор формируют наш взгляд на форму автомобиля…'),
  ('18 апреля 2025', 'Как мы делаем рукоятку КПП за 40 часов', ARRAY['Производство'], 'От эскиза до изделия — семь этапов, которые нельзя ускорить без потери качества…');

-- Team
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  note TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE
);

INSERT INTO team_members (name, role, note, sort_order) VALUES
  ('Алессандро Р.', 'Основатель и главный дизайнер', 'Миланская школа, 14 лет в автостайлинге', 1),
  ('Максим К.', 'Технический директор', 'Инженер-конструктор, специализация — интерьер', 2),
  ('Юлия Т.', 'Менеджер проектов', 'Связь с клиентами и координация заказов', 3);
