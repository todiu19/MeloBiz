-- MeloBiz PostgreSQL schema
-- PostgreSQL 15+
--
-- Chạy:
--   createdb melobiz
--   psql -d melobiz -f backend/database/schema.sql
--
-- Thiết kế này lưu tiền bằng NUMERIC và thời gian bằng TIMESTAMPTZ.
-- Mật khẩu, session token và device key chỉ được lưu dưới dạng hash.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE account_status AS ENUM (
  'active',
  'suspended',
  'closed'
);

CREATE TYPE member_role AS ENUM (
  'owner',
  'admin',
  'manager',
  'staff'
);

CREATE TYPE membership_status AS ENUM (
  'invited',
  'active',
  'suspended',
  'removed'
);

CREATE TYPE location_status AS ENUM (
  'active',
  'inactive',
  'closed'
);

CREATE TYPE device_status AS ENUM (
  'pending',
  'active',
  'revoked'
);

CREATE TYPE billing_interval AS ENUM (
  'month',
  'year'
);

CREATE TYPE subscription_status AS ENUM (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'expired'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded',
  'canceled'
);

CREATE TYPE license_status AS ENUM (
  'active',
  'expired',
  'revoked'
);

CREATE TYPE youtube_channel_status AS ENUM (
  'pending',
  'whitelisted',
  'rejected',
  'removed'
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Tài khoản, doanh nghiệp và điểm phát
-- ---------------------------------------------------------------------------

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  tax_code TEXT,
  billing_email TEXT,
  phone TEXT,
  address_line TEXT,
  ward TEXT,
  city TEXT,
  country_code CHAR(2) NOT NULL DEFAULT 'VN',
  status account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT businesses_legal_name_not_blank CHECK (btrim(legal_name) <> ''),
  CONSTRAINT businesses_display_name_not_blank CHECK (btrim(display_name) <> '')
);

CREATE UNIQUE INDEX businesses_tax_code_unique
  ON businesses (tax_code)
  WHERE tax_code IS NOT NULL;

CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  status account_status NOT NULL DEFAULT 'active',
  role member_role NOT NULL DEFAULT 'staff',
  membership_status membership_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT app_users_email_not_blank CHECK (btrim(email) <> ''),
  CONSTRAINT app_users_name_not_blank CHECK (btrim(full_name) <> '')
);

CREATE UNIQUE INDEX app_users_email_unique
  ON app_users (lower(email));

CREATE INDEX app_users_business
  ON app_users (business_id);

CREATE UNIQUE INDEX one_active_owner_per_business
  ON app_users (business_id)
  WHERE role = 'owner'
    AND membership_status = 'active';

CREATE TABLE oauth_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  profile JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subject),
  UNIQUE (user_id, provider),
  CONSTRAINT oauth_identity_provider CHECK (provider IN ('google'))
);

CREATE INDEX oauth_identities_user
  ON oauth_identities (user_id);

CREATE TABLE business_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role member_role NOT NULL DEFAULT 'staff',
  token_hash TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT invitation_expiry_after_creation CHECK (expires_at > created_at)
);

CREATE INDEX business_invitations_lookup
  ON business_invitations (business_id, lower(email));

CREATE TABLE industry_groups (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT industry_groups_slug_format
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_slug TEXT NOT NULL REFERENCES industry_groups(slug),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  description TEXT NOT NULL,
  mood TEXT,
  accent_color CHAR(7),
  cover_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT industries_slug_format
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT industries_accent_color_format
    CHECK (accent_color IS NULL OR accent_color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX industries_catalog
  ON industries (is_active, is_featured DESC, sort_order);

CREATE INDEX industries_group
  ON industries (group_slug, sort_order)
  WHERE is_active = true;

CREATE TABLE industry_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (industry_id, sort_order)
);

CREATE TABLE industry_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (industry_id, sort_order)
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES industries(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  address_line TEXT NOT NULL,
  ward TEXT,
  city TEXT NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'VN',
  timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  status location_status NOT NULL DEFAULT 'active',
  opened_at DATE,
  closed_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, code),
  UNIQUE (id, business_id),
  CONSTRAINT locations_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT locations_dates_valid
    CHECK (closed_at IS NULL OR opened_at IS NULL OR closed_at >= opened_at)
);

CREATE INDEX locations_business_status
  ON locations (business_id, status);

CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT,
  serial_number TEXT,
  device_key_hash TEXT NOT NULL UNIQUE,
  status device_status NOT NULL DEFAULT 'pending',
  app_version TEXT,
  last_ip INET,
  activated_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX devices_serial_number_unique
  ON devices (serial_number)
  WHERE serial_number IS NOT NULL;

CREATE INDEX devices_location_status
  ON devices (location_id, status);

-- ---------------------------------------------------------------------------
-- Gói dịch vụ, thanh toán và giấy phép
-- ---------------------------------------------------------------------------

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  billing_interval billing_interval NOT NULL,
  price NUMERIC(14, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'VND',
  trial_days INTEGER NOT NULL DEFAULT 0,
  max_active_devices INTEGER NOT NULL DEFAULT 1,
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT plans_price_non_negative CHECK (price >= 0),
  CONSTRAINT plans_trial_days_non_negative CHECK (trial_days >= 0),
  CONSTRAINT plans_device_limit_positive CHECK (max_active_devices > 0)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status subscription_status NOT NULL DEFAULT 'trialing',
  trial_starts_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  current_period_starts_at TIMESTAMPTZ NOT NULL,
  current_period_ends_at TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  provider TEXT,
  provider_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT subscription_period_valid
    CHECK (current_period_ends_at > current_period_starts_at),
  CONSTRAINT subscription_trial_valid
    CHECK (
      (trial_starts_at IS NULL AND trial_ends_at IS NULL)
      OR
      (trial_starts_at IS NOT NULL AND trial_ends_at > trial_starts_at)
    )
);

CREATE UNIQUE INDEX one_current_subscription_per_location
  ON subscriptions (location_id)
  WHERE status IN ('trialing', 'active', 'past_due');

CREATE UNIQUE INDEX subscriptions_provider_reference_unique
  ON subscriptions (provider, provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;

CREATE INDEX subscriptions_renewal
  ON subscriptions (status, current_period_ends_at);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE RESTRICT,
  provider TEXT,
  provider_payment_id TEXT,
  amount NUMERIC(14, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'VND',
  status payment_status NOT NULL DEFAULT 'pending',
  failure_reason TEXT,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payments_amount_positive CHECK (amount > 0)
);

CREATE UNIQUE INDEX payments_provider_reference_unique
  ON payments (provider, provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;

CREATE INDEX payments_subscription_created
  ON payments (subscription_id, created_at DESC);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL UNIQUE REFERENCES payments(id) ON DELETE RESTRICT,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL UNIQUE,
  legal_name TEXT NOT NULL,
  tax_code TEXT,
  billing_address TEXT NOT NULL,
  subtotal NUMERIC(14, 2) NOT NULL,
  vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL,
  issued_at TIMESTAMPTZ,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT invoice_amounts_valid
    CHECK (
      subtotal >= 0
      AND vat_rate >= 0
      AND vat_amount >= 0
      AND total = subtotal + vat_amount
    )
);

CREATE INDEX invoices_business_issued
  ON invoices (business_id, issued_at DESC);

CREATE TABLE music_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  scope TEXT NOT NULL,
  status license_status NOT NULL DEFAULT 'active',
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  certificate_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT music_license_location_business
    FOREIGN KEY (location_id, business_id)
    REFERENCES locations(id, business_id)
    ON DELETE RESTRICT,
  CONSTRAINT music_license_code_format
    CHECK (code ~ '^MELO-[0-9]{4}-[A-Z0-9-]+$'),
  CONSTRAINT music_license_period_valid CHECK (valid_until >= valid_from)
);

CREATE UNIQUE INDEX one_active_license_per_location
  ON music_licenses (location_id)
  WHERE status = 'active';

CREATE INDEX music_license_public_lookup
  ON music_licenses (code, status);

CREATE INDEX music_license_expiry
  ON music_licenses (status, valid_until);

CREATE TABLE youtube_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL UNIQUE,
  channel_name TEXT NOT NULL,
  channel_url TEXT,
  status youtube_channel_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX youtube_channels_business_status
  ON youtube_channels (business_id, status);

-- ---------------------------------------------------------------------------
-- Kho nhạc và playlist
-- ---------------------------------------------------------------------------

CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country_code CHAR(2),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  isrc TEXT,
  duration_seconds INTEGER NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  artwork_url TEXT,
  rights_owner TEXT NOT NULL,
  license_scope TEXT NOT NULL,
  energy SMALLINT,
  bpm NUMERIC(6, 2),
  is_explicit BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tracks_duration_positive CHECK (duration_seconds > 0),
  CONSTRAINT tracks_energy_range CHECK (energy IS NULL OR energy BETWEEN 1 AND 5),
  CONSTRAINT tracks_bpm_positive CHECK (bpm IS NULL OR bpm > 0)
);

CREATE UNIQUE INDEX tracks_isrc_unique
  ON tracks (isrc)
  WHERE isrc IS NOT NULL;

CREATE INDEX tracks_active_published
  ON tracks (is_active, published_at DESC);

CREATE TABLE track_artists (
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'primary',
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (track_id, artist_id, role)
);

CREATE TABLE track_genres (
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (track_id, genre_id)
);

CREATE INDEX track_genres_by_genre
  ON track_genres (genre_id, track_id);

CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  mood TEXT,
  energy SMALLINT,
  artwork_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT playlists_energy_range
    CHECK (energy IS NULL OR energy BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX public_playlist_slug_unique
  ON playlists (slug)
  WHERE business_id IS NULL;

CREATE UNIQUE INDEX business_playlist_slug_unique
  ON playlists (business_id, slug)
  WHERE business_id IS NOT NULL;

CREATE TABLE playlist_tracks (
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE RESTRICT,
  position INTEGER NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (playlist_id, track_id),
  UNIQUE (playlist_id, position),
  CONSTRAINT playlist_track_position_positive CHECK (position > 0)
);

CREATE TABLE industry_playlists (
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (industry_id, playlist_id),
  UNIQUE (industry_id, sort_order)
);

-- ---------------------------------------------------------------------------
-- Lịch phát và lịch sử phát
-- ---------------------------------------------------------------------------

CREATE TABLE play_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX one_active_schedule_per_location
  ON play_schedules (location_id)
  WHERE is_active = true;

CREATE TABLE play_schedule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES play_schedules(id) ON DELETE CASCADE,
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE RESTRICT,
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (schedule_id, day_of_week, start_time),
  CONSTRAINT schedule_day_range CHECK (day_of_week BETWEEN 0 AND 6),
  CONSTRAINT schedule_time_range CHECK (end_time > start_time)
);

CREATE INDEX play_schedule_items_daily
  ON play_schedule_items (schedule_id, day_of_week, start_time);

CREATE TABLE play_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE RESTRICT,
  playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  seconds_played INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT play_history_time_valid
    CHECK (ended_at IS NULL OR ended_at >= started_at),
  CONSTRAINT play_history_seconds_non_negative
    CHECK (seconds_played IS NULL OR seconds_played >= 0)
);

CREATE INDEX play_history_location_time
  ON play_history (location_id, started_at DESC);

CREATE INDEX play_history_device_time
  ON play_history (device_id, started_at DESC);

CREATE INDEX play_history_track_time
  ON play_history (track_id, started_at DESC);

-- ---------------------------------------------------------------------------
-- Xác thực, liên hệ và audit
-- ---------------------------------------------------------------------------

CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT auth_session_expiry_valid CHECK (expires_at > created_at)
);

CREATE INDEX auth_sessions_user_active
  ON auth_sessions (user_id, expires_at)
  WHERE revoked_at IS NULL;

CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contact_request_status
    CHECK (status IN ('new', 'in_progress', 'resolved', 'closed'))
);

CREATE INDEX contact_requests_work_queue
  ON contact_requests (status, created_at);

CREATE TABLE audit_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  ip_address INET,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_business_time
  ON audit_logs (business_id, created_at DESC);

CREATE INDEX audit_logs_entity
  ON audit_logs (entity_type, entity_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Tự động cập nhật updated_at
-- ---------------------------------------------------------------------------

CREATE TRIGGER app_users_set_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER oauth_identities_set_updated_at
BEFORE UPDATE ON oauth_identities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER businesses_set_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER industries_set_updated_at
BEFORE UPDATE ON industries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER locations_set_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER devices_set_updated_at
BEFORE UPDATE ON devices
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER plans_set_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER subscriptions_set_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER music_licenses_set_updated_at
BEFORE UPDATE ON music_licenses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER youtube_channels_set_updated_at
BEFORE UPDATE ON youtube_channels
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER artists_set_updated_at
BEFORE UPDATE ON artists
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tracks_set_updated_at
BEFORE UPDATE ON tracks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER playlists_set_updated_at
BEFORE UPDATE ON playlists
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER play_schedules_set_updated_at
BEFORE UPDATE ON play_schedules
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER contact_requests_set_updated_at
BEFORE UPDATE ON contact_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Dữ liệu nền cho MeloBiz
-- ---------------------------------------------------------------------------

INSERT INTO plans (
  code,
  name,
  billing_interval,
  price,
  currency,
  trial_days,
  max_active_devices,
  features
)
VALUES (
  'melobiz-pro-monthly',
  'MeloBiz Pro',
  'month',
  199000,
  'VND',
  14,
  1,
  '{
    "unlimited_music": true,
    "scheduled_playback": true,
    "member_management": true,
    "play_history": true,
    "license_certificate": true,
    "vat_invoice": true
  }'::jsonb
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO industry_groups (slug, name, sort_order)
VALUES
  ('hospitality', 'Ẩm thực và lưu trú', 1),
  ('wellness', 'Làm đẹp và thư giãn', 2),
  ('retail', 'Bán lẻ', 3),
  ('fitness', 'Thể thao', 4),
  ('healthcare', 'Chăm sóc sức khỏe', 5),
  ('workplace', 'Nơi làm việc', 6),
  ('entertainment', 'Giải trí', 7),
  ('transport', 'Giao thông', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO industries (
  group_slug,
  slug,
  name,
  headline,
  excerpt,
  description,
  mood,
  accent_color,
  sort_order,
  is_featured
)
VALUES
  ('hospitality', 'quan-ca-phe', 'Quán cà phê', 'Nhạc cho quán cà phê có chất riêng', 'Giữ nhịp vừa đủ để khách muốn ngồi lâu hơn.', 'Playlist thay đổi theo khung giờ và cá tính của quán.', 'Chậm & ấm', '#ff8a65', 1, true),
  ('hospitality', 'nha-hang', 'Nhà hàng', 'Âm nhạc nâng trải nghiệm bàn ăn', 'Tinh tế và không lấn át cuộc trò chuyện.', 'Âm nhạc phù hợp cho từng ca phục vụ và phong cách ẩm thực.', 'Tinh tế', '#d79a55', 2, true),
  ('wellness', 'spa-wellness', 'Spa & Wellness', 'Đưa khách vào trạng thái thư giãn', 'Âm thanh liền mạch cho hành trình phục hồi.', 'Những lớp âm thanh mềm cho sảnh chờ và phòng trị liệu.', 'Thư giãn', '#73b9a0', 3, true),
  ('fitness', 'phong-gym', 'Phòng gym', 'Giữ năng lượng cho từng nhịp tập', 'Nhịp mạnh đúng lúc và bền bỉ suốt ca vận hành.', 'Playlist theo cường độ và từng khung giờ tập luyện.', 'Năng lượng', '#7fa7ed', 4, true),
  ('hospitality', 'khach-san', 'Khách sạn', 'Một bản sắc âm thanh xuyên suốt', 'Từ sảnh đến nhà hàng đều đồng nhất.', 'Cá tính âm thanh riêng cho từng khu vực khách sạn.', 'Thanh lịch', '#b698d4', 5, true),
  ('retail', 'cua-hang-ban-le', 'Cửa hàng bán lẻ', 'Tạo nhịp mua sắm đúng với thương hiệu', 'Đưa khách vào đúng mood của bộ sưu tập.', 'Playlist theo tệp khách hàng, mùa và chiến dịch.', 'Tươi mới', '#ef7da6', 6, true),
  ('hospitality', 'quan-bar-lounge', 'Quán bar & lounge', 'Nhạc cho quán bar và lounge', 'Tạo bầu không khí cuốn hút.', 'Âm nhạc theo nhịp hoạt động của quán bar và lounge.', 'Cuốn hút', '#bf7b64', 7, false),
  ('wellness', 'salon-toc', 'Salon tóc', 'Nhạc cho salon tóc', 'Không gian thời thượng và dễ chịu.', 'Playlist phù hợp trải nghiệm tại salon.', 'Thời thượng', '#c995a1', 8, false),
  ('retail', 'sieu-thi', 'Siêu thị', 'Nhạc cho siêu thị', 'Không khí mua sắm thân thiện.', 'Âm nhạc vận hành ổn định trong suốt ngày.', 'Thân thiện', '#b99b63', 9, false),
  ('retail', 'trung-tam-thuong-mai', 'Trung tâm thương mại', 'Nhạc cho trung tâm thương mại', 'Không gian hiện đại và liền mạch.', 'Playlist cho nhiều khu vực và khung giờ.', 'Hiện đại', '#a7826b', 10, false),
  ('healthcare', 'phong-kham', 'Phòng khám', 'Nhạc cho phòng khám', 'Tạo cảm giác an tâm.', 'Âm thanh nhẹ nhàng cho khu vực chờ.', 'An tâm', '#8cac9d', 11, false),
  ('healthcare', 'nha-khoa', 'Nha khoa', 'Nhạc cho nha khoa', 'Giảm căng thẳng trong thời gian chờ.', 'Playlist nhẹ nhàng cho phòng chờ nha khoa.', 'Nhẹ nhàng', '#93aaa5', 12, false),
  ('retail', 'showroom-o-to', 'Showroom ô tô', 'Nhạc cho showroom ô tô', 'Tạo trải nghiệm cao cấp.', 'Âm thanh hiện đại cho không gian trưng bày.', 'Cao cấp', '#8c8780', 13, false),
  ('workplace', 'van-phong', 'Văn phòng', 'Nhạc cho văn phòng', 'Tăng sự tập trung vừa phải.', 'Âm nhạc nền phù hợp môi trường làm việc.', 'Tập trung', '#9b927c', 14, false),
  ('hospitality', 'quan-nhau', 'Quán nhậu', 'Nhạc cho quán nhậu', 'Không khí rộn ràng và gần gũi.', 'Playlist theo nhịp đông khách của quán.', 'Rộn ràng', '#c27c55', 15, false),
  ('entertainment', 'khu-vui-choi', 'Khu vui chơi', 'Nhạc cho khu vui chơi', 'Năng lượng vui tươi.', 'Âm nhạc tích cực cho khách hàng gia đình.', 'Vui tươi', '#d09a63', 16, false),
  ('transport', 'san-bay', 'Sân bay', 'Nhạc cho sân bay', 'Không gian thư thái hơn trong lúc chờ.', 'Âm nhạc nền cho khu vực công cộng và phòng chờ.', 'Thư thái', '#899b9c', 17, false),
  ('entertainment', 'phong-tra', 'Phòng trà & lounge', 'Nhạc cho phòng trà và lounge', 'Không khí sâu lắng và tinh tế.', 'Playlist jazz, acoustic và soul cho phòng trà.', 'Sâu lắng', '#a27360', 18, false)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
