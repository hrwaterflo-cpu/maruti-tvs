-- ============================================================
-- MARUTI TVS - Spare Parts Inventory & Showroom Database Schema
-- Source Catalogue: TVS Scooty Streak Parts Catalogue (Rev 01)
-- ============================================================

-- 1. Spare Parts Table
CREATE TABLE IF NOT EXISTS public.spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  assembly TEXT NOT NULL,
  fig_no TEXT NOT NULL DEFAULT 'FIG.No. 01',
  vehicle_model TEXT NOT NULL DEFAULT 'TVS Scooty Streak',
  catalog_qty INTEGER NOT NULL DEFAULT 1,
  stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  min_stock INTEGER NOT NULL DEFAULT 5 CHECK (min_stock >= 0),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  rack_location TEXT NOT NULL DEFAULT 'A-01',
  remarks TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast search by assembly, model, stock
CREATE INDEX IF NOT EXISTS idx_spare_parts_assembly ON public.spare_parts(assembly);
CREATE INDEX IF NOT EXISTS idx_spare_parts_stock ON public.spare_parts(stock_qty);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_spare_parts_updated_at ON public.spare_parts;
CREATE TRIGGER set_spare_parts_updated_at
  BEFORE UPDATE ON public.spare_parts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Customer Enquiries Table (Vehicle Test Ride / Spare Part Request)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  enquiry_type TEXT NOT NULL DEFAULT 'spare_part',
  item_name TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Row Level Security (RLS) & Role Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.spare_parts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.spare_parts TO authenticated;
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;

ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Spare Parts Policies:
-- Public website can read parts (availability check)
DROP POLICY IF EXISTS "Public can view spare parts" ON public.spare_parts;
CREATE POLICY "Public can view spare parts"
  ON public.spare_parts FOR SELECT
  USING (true);

-- Only authenticated admin users can insert/update/delete spare parts
DROP POLICY IF EXISTS "Authenticated users can insert spare parts" ON public.spare_parts;
CREATE POLICY "Authenticated users can insert spare parts"
  ON public.spare_parts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update spare parts" ON public.spare_parts;
CREATE POLICY "Authenticated users can update spare parts"
  ON public.spare_parts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete spare parts" ON public.spare_parts;
CREATE POLICY "Authenticated users can delete spare parts"
  ON public.spare_parts FOR DELETE
  TO authenticated
  USING (true);

-- Enquiries Policies:
-- Anyone visiting the website can submit an enquiry
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can view/update/delete enquiries
DROP POLICY IF EXISTS "Authenticated users can view enquiries" ON public.enquiries;
CREATE POLICY "Authenticated users can view enquiries"
  ON public.enquiries FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update enquiries" ON public.enquiries;
CREATE POLICY "Authenticated users can update enquiries"
  ON public.enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete enquiries" ON public.enquiries;
CREATE POLICY "Authenticated users can delete enquiries"
  ON public.enquiries FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 4. Seed Data: Real TVS Scooty Streak Parts Catalogue (FIG 01 - 26)
-- ============================================================
INSERT INTO public.spare_parts
  (part_no, name, assembly, fig_no, vehicle_model, catalog_qty, stock_qty, min_stock, price, rack_location, remarks)
VALUES
  -- FIG.No. 01 - CYLINDER HEAD ASSEMBLY
  ('S1010320', 'COTTOR VALVE', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 4, 24, 8, 35.00, 'A-01', 'Kit item'),
  ('N2011040', 'RETAINER VALVE SPRING', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 2, 14, 5, 65.00, 'A-01', 'Kit item'),
  ('N2010350', 'SPRING VALVE OUTER', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 2, 12, 5, 95.00, 'A-01', 'Kit item'),
  ('N2010340', 'SPRING VALVE INNER', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 2, 10, 5, 75.00, 'A-01', 'Kit item'),
  ('N4011100', 'SEAL VALVE STEM OIL', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 2, 18, 6, 55.00, 'A-01', 'Fast moving'),
  ('K3010570', 'VALVE INTAKE', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 7, 4, 240.00, 'A-02', 'Kit item'),
  ('T4010690', 'VALVE EXHAUST', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 3, 4, 265.00, 'A-02', 'Low stock'),
  ('K6010200', 'ARM COMP. VALVE ROCKER', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 2, 6, 4, 385.00, 'A-02', 'Kit item'),
  ('K3011110', 'HEAD COMP. CYLINDER', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 2, 2, 2450.00, 'A-03', 'Major assembly'),
  ('K3040950', 'PIPE COMP. INTAKE', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 5, 3, 320.00, 'A-03', ''),
  ('K3010150', 'SPROCKET CAMSHAFT 32T', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 8, 3, 210.00, 'A-03', ''),
  ('K3011150', 'CAMSHAFT COMP.', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 0, 3, 890.00, 'A-03', 'Reorder urgent'),
  ('N2180040', 'SPARK PLUG', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 35, 10, 115.00, 'A-04', 'High demand'),
  ('K3010750', 'PACKING SEAL COVER CYL. HD', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 16, 5, 60.00, 'A-04', ''),
  ('K3320680', 'COVER CYLINDER HEAD ASSY.', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 4, 3, 540.00, 'A-04', ''),
  ('F085230', 'BOLT OIL DRAIN', 'Cylinder Head Assembly', 'FIG.No. 01', 'TVS Scooty Streak', 1, 15, 5, 45.00, 'A-04', ''),

  -- FIG.No. 02 - CYLINDER BLOCK & CRANK SHAFT ASSY.
  ('K3011080', 'GASKET CYLINDER HEAD', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 22, 6, 85.00, 'A-05', 'Fast moving'),
  ('K3011040', 'CYLINDER BLOCK STD', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 3, 3, 1850.00, 'A-05', ''),
  ('K3010430', 'ADJUSTER ASSY. TENSIONER', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 6, 3, 295.00, 'A-05', ''),
  ('K3011070', 'GASKET CYLINDER', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 20, 6, 45.00, 'A-05', ''),
  ('K3010670', 'GUIDE CAMCHAIN', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 9, 4, 145.00, 'A-06', ''),
  ('N2200390', 'BALL BEARING (25x52x15)', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 8, 4, 310.00, 'A-06', ''),
  ('K3020420', 'CRANKSHAFT COMP.', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 1, 2, 2650.00, 'A-06', 'Low stock'),
  ('K3010230', 'CHAIN 84 LINKS', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 11, 5, 275.00, 'A-06', ''),
  ('K3010700', 'TENSIONER CAM CHAIN', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 7, 4, 165.00, 'A-06', ''),
  ('K3321090', 'PISTON KIT STD', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 6, 4, 680.00, 'A-07', 'Fast moving'),
  ('K3321100', 'PISTON KIT I O/S', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 4, 3, 695.00, 'A-07', ''),
  ('N5320440', 'RING SET PISTON STD', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 14, 5, 290.00, 'A-07', ''),
  ('K3321120', 'CYLINDER BLOCK & PISTON KIT', 'Cylinder Block & Crank Shaft Assy.', 'FIG.No. 02', 'TVS Scooty Streak', 1, 0, 2, 2490.00, 'A-07', 'Not illustrated - Out of stock'),

  -- FIG.No. 03 - CLUTCH & VARIAMATIC ASSEMBLY
  ('K3200090', 'NEEDLE ROLLER BEARING', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 10, 4, 185.00, 'B-01', ''),
  ('K3080640', 'FACE COMP. FIXED DRIVEN', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 4, 3, 620.00, 'B-01', ''),
  ('K3080820', 'V - BELT DRIVE', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 18, 6, 465.00, 'B-01', 'High demand'),
  ('K3080670', 'FACE COMP. MOVABLE DRIVEN', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 3, 3, 640.00, 'B-01', ''),
  ('K3080690', 'SPRING MOVABLE DRIVEN', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 8, 4, 195.00, 'B-02', ''),
  ('K3070300', 'CLUTCH SHOE SET', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 9, 5, 780.00, 'B-02', 'Kit consists of * items'),
  ('K3070580', 'HOUSING COMP. CLUTCH', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 5, 3, 690.00, 'B-02', ''),
  ('K3081910', 'STARTER GEAR COMP.', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 4, 3, 410.00, 'B-02', ''),
  ('K3082070', 'ROLLER COMP. MOVABLE DR.', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 6, 24, 12, 55.00, 'B-03', 'Set of 6 per scooter'),
  ('K3082300', 'FACE COMP. MOVABLE DRIVE', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 0, 3, 520.00, 'B-03', 'Out of stock'),
  ('K3081550', 'FACE COMP. FIXED DRIVE', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 6, 3, 390.00, 'B-03', ''),
  ('K3320650', 'ASSY. KIT FACE COMP. DRIVE', 'Clutch & Variamatic Assembly', 'FIG.No. 03', 'TVS Scooty Streak', 1, 2, 3, 1250.00, 'B-03', 'Low stock'),

  -- FIG.No. 04 - CRANKCASE COMP. LH & OIL PUMP ASSY.
  ('K3060060', 'MOTOR ASSY. STARTER', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 5, 3, 1380.00, 'B-04', ''),
  ('K3321160', 'KIT CRANKCASE ASSY. LH', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 1, 2, 3250.00, 'B-04', 'Low stock'),
  ('S1090500', 'SILENT BLOCK SHOCK ABSOR.', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 12, 5, 90.00, 'B-04', ''),
  ('K3082580', 'OIL PUMP ASSY.', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 6, 3, 480.00, 'B-05', ''),
  ('K3081750', 'OIL FILTER', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 28, 10, 75.00, 'B-05', 'High demand'),
  ('K3060070', 'BENDIX DRIVE', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 4, 3, 560.00, 'B-05', ''),
  ('K3081880', 'DRAIN PLUG', 'Crankcase Comp. LH & Oil Pump Assy.', 'FIG.No. 04', 'TVS Scooty Streak', 1, 15, 5, 65.00, 'B-05', ''),

  -- FIG.No. 05 - CRANKCASE RH & MAGNETO ASSY.
  ('K3180330', 'COVER FAN', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 7, 3, 210.00, 'B-06', ''),
  ('K3180280', 'FAN', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 9, 4, 180.00, 'B-06', ''),
  ('K3060340', 'MAGNETO ASSEMBLY 12V', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 3, 2, 1690.00, 'B-06', ''),
  ('K3060090', 'STATOR PLATE ASSEMBLY', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 4, 3, 940.00, 'B-06', ''),
  ('K3060260', 'THERMAL SENSOR', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 6, 3, 240.00, 'B-07', ''),
  ('K3060410', 'IGNITION COIL', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 10, 4, 360.00, 'B-07', ''),
  ('N2180110', 'CAP ASSY SPARK PLUG', 'Crankcase RH & Magneto Assy.', 'FIG.No. 05', 'TVS Scooty Streak', 1, 16, 6, 95.00, 'B-07', ''),

  -- FIG.No. 06 - GEAR & GEAR CASE ASSY.
  ('K3200750', 'OILSEAL WHEEL SHAFT', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 14, 5, 85.00, 'C-01', ''),
  ('K3082400', 'SHAFT COMP. REAR WHEEL', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 3, 2, 740.00, 'C-01', ''),
  ('K3081490', 'GASKET GEAR CASE', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 18, 6, 50.00, 'C-01', ''),
  ('K3082660', 'GEAR CASE', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 2, 2, 1180.00, 'C-01', ''),
  ('K3081810', 'GEAR INTERMEDIATE', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 4, 3, 490.00, 'C-02', ''),
  ('K3082470', 'SHAFT CLUTCH (22 SPLINES)', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 5, 3, 560.00, 'C-02', ''),
  ('K3200980', 'BALL BEARING 6004', 'Gear & Gear Case Assy.', 'FIG.No. 06', 'TVS Scooty Streak', 1, 12, 5, 195.00, 'C-02', ''),

  -- FIG.No. 07 - COVER VARIATOR & KICKSTARTER ASSY.
  ('K3081540', 'COVER FAN CVT', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 6, 3, 260.00, 'C-03', ''),
  ('K3081530', 'SPRING KICK STARTER', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 11, 5, 125.00, 'C-03', ''),
  ('K3081300', 'GEAR COMP KICK STARTER DR.', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 7, 3, 340.00, 'C-03', ''),
  ('K3320740', 'COVER VARIATOR', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 2, 2, 1420.00, 'C-03', ''),
  ('K3030310', 'GASKET COVER VARIATOR', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 15, 5, 70.00, 'C-04', ''),
  ('K3081660', 'LEVER ASSY. KICK STARTER', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 8, 4, 420.00, 'C-04', ''),
  ('K3081970', 'FOAM FILTER', 'Cover Variator & Kickstarter Assy.', 'FIG.No. 07', 'TVS Scooty Streak', 1, 20, 6, 65.00, 'C-04', ''),

  -- FIG.No. 08 - CARBURETTOR ASSEMBLY
  ('K3041100', 'CARBURETTOR ASSY.', 'Carburettor Assembly', 'FIG.No. 08', 'TVS Scooty Streak', 1, 3, 2, 2150.00, 'C-05', ''),
  ('K3320460', 'SOLENOID CHOKE ASSY.', 'Carburettor Assembly', 'FIG.No. 08', 'TVS Scooty Streak', 1, 5, 3, 640.00, 'C-05', ''),
  ('K3320330', 'FLOAT ASSY.', 'Carburettor Assembly', 'FIG.No. 08', 'TVS Scooty Streak', 1, 9, 4, 185.00, 'C-05', ''),
  ('K3321200', 'MAIN JET', 'Carburettor Assembly', 'FIG.No. 08', 'TVS Scooty Streak', 1, 14, 5, 75.00, 'C-05', ''),
  ('R1320400', 'PILOT JET', 'Carburettor Assembly', 'FIG.No. 08', 'TVS Scooty Streak', 1, 12, 5, 75.00, 'C-05', ''),
  ('K3320360', 'SEAL FLOAT BODY', 'Carburettor Assembly', 'FIG.No. 08', 'TVS Scooty Streak', 1, 16, 6, 55.00, 'C-05', ''),

  -- FIG.No. 09 - AIR CLEANER ASSEMBLY
  ('K3040870', 'AIR CLEANER ASSEMBLY', 'Air Cleaner Assembly', 'FIG.No. 09', 'TVS Scooty Streak', 1, 5, 3, 680.00, 'C-06', ''),
  ('K3040100', 'FOAM AIR CLEANER', 'Air Cleaner Assembly', 'FIG.No. 09', 'TVS Scooty Streak', 1, 30, 10, 120.00, 'C-06', 'High demand'),
  ('K3040190', 'SEAL AIR CLEANER', 'Air Cleaner Assembly', 'FIG.No. 09', 'TVS Scooty Streak', 1, 12, 5, 45.00, 'C-06', ''),

  -- FIG.No. 10 - SECONDARY AIR INJECTION ASSY.
  ('K3040600', 'FILTER COMP. AIR INJECTION', 'Secondary Air Injection Assy.', 'FIG.No. 10', 'TVS Scooty Streak', 1, 6, 3, 310.00, 'C-07', ''),
  ('N8040250', 'SECONDARY AIR INJEC. VALVE', 'Secondary Air Injection Assy.', 'FIG.No. 10', 'TVS Scooty Streak', 1, 4, 3, 490.00, 'C-07', ''),
  ('K3040210', 'PIPE COMP. AIR INJECTION', 'Secondary Air Injection Assy.', 'FIG.No. 10', 'TVS Scooty Streak', 1, 5, 3, 240.00, 'C-07', ''),

  -- FIG.No. 11 - MUFFLER ASSEMBLY
  ('K3050460', 'GUARD MUFFLER ASSY.', 'Muffler Assembly', 'FIG.No. 11', 'TVS Scooty Streak', 1, 7, 4, 290.00, 'D-01', ''),
  ('K3051460', 'BODY COMP. MUFFLER', 'Muffler Assembly', 'FIG.No. 11', 'TVS Scooty Streak', 1, 0, 2, 2850.00, 'D-01', 'Out of stock'),
  ('T4050180', 'GASKET PIPE EXHAUST', 'Muffler Assembly', 'FIG.No. 11', 'TVS Scooty Streak', 1, 25, 8, 45.00, 'D-01', 'Fast moving'),
  ('K3321250', 'MUFFLER ASSY. WITH GUARD', 'Muffler Assembly', 'FIG.No. 11', 'TVS Scooty Streak', 1, 2, 2, 3150.00, 'D-01', ''),

  -- FIG.No. 12 - HANDLE BAR & CABLE ASSY.
  ('K3150370', 'GRIP COMP. THROTTLE', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 14, 5, 135.00, 'D-02', ''),
  ('K3150260', 'BRAKE LEVER RH', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 16, 6, 145.00, 'D-02', 'Fast moving'),
  ('K3150250', 'BRAKE LEVER LH', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 15, 6, 145.00, 'D-02', 'Fast moving'),
  ('D163320', 'ASSY. SWITCH STOP LAMP', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 2, 18, 6, 85.00, 'D-02', ''),
  ('K3150360', 'GRIP LH', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 14, 5, 95.00, 'D-03', ''),
  ('K3150720', 'HANDLE BAR COMP.', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 3, 2, 760.00, 'D-03', ''),
  ('K3170020', 'CABLE ASSY REAR BRAKE', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 20, 8, 225.00, 'D-03', 'High demand'),
  ('K3170050', 'CABLE ASSY THROTTLE', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 18, 8, 195.00, 'D-03', 'High demand'),
  ('K3170030', 'CABLE ASSY FRONT BRAKE', 'Handle Bar & Cable Assy.', 'FIG.No. 12', 'TVS Scooty Streak', 1, 22, 8, 175.00, 'D-03', 'High demand'),

  -- FIG.No. 13 - TANK ASSEMBLY
  ('K3161320', 'FUEL SENDER UNIT', 'Tank Assembly', 'FIG.No. 13', 'TVS Scooty Streak', 1, 6, 3, 410.00, 'D-04', ''),
  ('K3140780', 'FUEL TANK CAP', 'Tank Assembly', 'FIG.No. 13', 'TVS Scooty Streak', 1, 11, 4, 165.00, 'D-04', ''),
  ('K3140640', 'FUEL TANK ASSY.', 'Tank Assembly', 'FIG.No. 13', 'TVS Scooty Streak', 1, 2, 2, 1680.00, 'D-04', ''),
  ('N4140080', 'AUTO FUEL COCK ASSY.', 'Tank Assembly', 'FIG.No. 13', 'TVS Scooty Streak', 1, 8, 4, 345.00, 'D-04', ''),

  -- FIG.No. 14 - HEAD LAMP ASSY. & HOUSING ASSY.
  ('K3161160', 'HEAD LAMP ASSEMBLY', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 6, 3, 980.00, 'D-05', ''),
  ('S1160150', 'BULB 12V 35/35W', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 32, 10, 110.00, 'D-05', 'High demand'),
  ('K3161410', 'BULB HOLDER HEAD LAMP', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 12, 5, 135.00, 'D-05', ''),
  ('K3220350', 'HOUSING HEADLAMP REAR', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 4, 3, 420.00, 'D-05', ''),
  ('K3160390', 'SWITCH STARTER', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 14, 5, 95.00, 'D-06', ''),
  ('K3160800', 'SWITCH LIGHTING', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 11, 5, 110.00, 'D-06', ''),
  ('S1160360', 'SWITCH TURN SIGNAL LAMP', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 13, 5, 125.00, 'D-06', ''),
  ('K3160380', 'SWITCH HORN', 'Head Lamp Assy. & Housing Assy.', 'FIG.No. 14', 'TVS Scooty Streak', 1, 15, 5, 90.00, 'D-06', ''),

  -- FIG.No. 15 - SEAT ASSEMBLY
  ('K3130360', 'SEAT ASSEMBLY', 'Seat Assembly', 'FIG.No. 15', 'TVS Scooty Streak', 1, 3, 2, 1650.00, 'E-01', ''),
  ('K3130450', 'COVER COMP. SEAT', 'Seat Assembly', 'FIG.No. 15', 'TVS Scooty Streak', 1, 8, 4, 380.00, 'E-01', ''),
  ('K3130430', 'HINGE SEAT COMP.', 'Seat Assembly', 'FIG.No. 15', 'TVS Scooty Streak', 1, 6, 3, 195.00, 'E-01', ''),

  -- FIG.No. 16 & 17 - FRAME, FOOTREST & STAND ASSY.
  ('K3121170', 'IGNITION LOCK', 'Frame Comp. & Footrest Assy.', 'FIG.No. 16', 'TVS Scooty Streak', 1, 7, 4, 540.00, 'E-02', ''),
  ('K3130090', 'LATCH ASSY. SEAT', 'Frame Comp. & Footrest Assy.', 'FIG.No. 16', 'TVS Scooty Streak', 1, 6, 3, 280.00, 'E-02', ''),
  ('K3220530', 'PILLION HANDLE (BLACK)', 'Frame Comp. & Footrest Assy.', 'FIG.No. 16', 'TVS Scooty Streak', 1, 4, 3, 620.00, 'E-02', ''),
  ('K3090230', 'SHOCK ABSORBER ASSY.', 'Frame Comp. & Footrest Assy.', 'FIG.No. 16', 'TVS Scooty Streak', 1, 5, 3, 1150.00, 'E-02', ''),
  ('K3124320', 'CENTER STAND ASSY.', 'Center Stand & Prop Stand Assy.', 'FIG.No. 17', 'TVS Scooty Streak', 1, 6, 3, 640.00, 'E-03', ''),
  ('K3120920', 'PROP STAND COMP.', 'Center Stand & Prop Stand Assy.', 'FIG.No. 17', 'TVS Scooty Streak', 1, 9, 4, 245.00, 'E-03', ''),
  ('K3122140', 'SPRING CENTER STAND', 'Center Stand & Prop Stand Assy.', 'FIG.No. 17', 'TVS Scooty Streak', 1, 16, 6, 65.00, 'E-03', ''),

  -- FIG.No. 18 - FRONT FORK ASSEMBLY
  ('K3101170', 'FORK ASSY. FRONT', 'Front Fork Assembly', 'FIG.No. 18', 'TVS Scooty Streak', 1, 2, 2, 3450.00, 'E-04', ''),
  ('K3100330', 'OIL SEAL FRONT FORK', 'Front Fork Assembly', 'FIG.No. 18', 'TVS Scooty Streak', 2, 24, 8, 95.00, 'E-04', 'Fast moving'),
  ('K3100340', 'SEAL DUST', 'Front Fork Assembly', 'FIG.No. 18', 'TVS Scooty Streak', 2, 18, 6, 75.00, 'E-04', ''),
  ('K3320110', 'STEERING CONE KIT', 'Front Fork Assembly', 'FIG.No. 18', 'TVS Scooty Streak', 1, 11, 5, 430.00, 'E-04', 'High demand'),
  ('K9100170', 'PIVOT STEERING COMP.', 'Front Fork Assembly', 'FIG.No. 18', 'TVS Scooty Streak', 1, 3, 2, 1290.00, 'E-04', 'Replaces K3100170'),

  -- FIG.No. 19 & 20 - FRONT & REAR WHEEL ASSEMBLY
  ('K3110530', 'SPEEDO DRIVE ASSY', 'Front Wheel Assembly', 'FIG.No. 19', 'TVS Scooty Streak', 1, 7, 4, 295.00, 'F-01', ''),
  ('K3110950', 'TYRE 90/90-10', 'Front Wheel Assembly', 'FIG.No. 19', 'TVS Scooty Streak', 1, 8, 4, 1280.00, 'F-01', 'Fits Front & Rear'),
  ('K3110960', 'TUBE 90/90-10', 'Front Wheel Assembly', 'FIG.No. 19', 'TVS Scooty Streak', 1, 16, 6, 260.00, 'F-01', 'Fits Front & Rear'),
  ('K31102603C', 'RIM COMP. WHEEL', 'Front Wheel Assembly', 'FIG.No. 19', 'TVS Scooty Streak', 1, 4, 3, 980.00, 'F-01', ''),
  ('C8110090', 'BRAKE SHOE SET 110 DIA (FRONT)', 'Front Wheel Assembly', 'FIG.No. 19', 'TVS Scooty Streak', 1, 28, 10, 215.00, 'F-02', 'High demand'),
  ('N5111250', 'BRAKE SHOE SET 110 DIA (REAR)', 'Rear Wheel Assembly', 'FIG.No. 20', 'TVS Scooty Streak', 1, 3, 10, 225.00, 'F-02', 'Low stock - reorder'),
  ('K3200770', 'BALL BEARING 6201', 'Front Wheel Assembly', 'FIG.No. 19', 'TVS Scooty Streak', 1, 20, 8, 145.00, 'F-02', ''),
  ('K3110510', 'LEVER COMP. BRAKE REAR', 'Rear Wheel Assembly', 'FIG.No. 20', 'TVS Scooty Streak', 1, 7, 4, 165.00, 'F-02', ''),

  -- FIG.No. 21 & 22 - TAIL LAMP, REAR FENDER & SPEEDOMETER
  ('K3161170', 'TAIL LAMP ASSY.', 'Tail Lamp & Rear Fender Assembly', 'FIG.No. 21', 'TVS Scooty Streak', 1, 5, 3, 860.00, 'F-03', ''),
  ('K3321430', 'LED POSITION LAMP', 'Tail Lamp & Rear Fender Assembly', 'FIG.No. 21', 'TVS Scooty Streak', 1, 0, 3, 420.00, 'F-03', 'Out of stock'),
  ('N4160210', 'BULB STOP LAMP', 'Tail Lamp & Rear Fender Assembly', 'FIG.No. 21', 'TVS Scooty Streak', 1, 25, 8, 45.00, 'F-03', ''),
  ('K3220520', 'FENDER REAR', 'Tail Lamp & Rear Fender Assembly', 'FIG.No. 21', 'TVS Scooty Streak', 1, 4, 3, 520.00, 'F-03', ''),
  ('K3220360', 'SPEEDOMETER ASSY.', 'Speedometer Assy.', 'FIG.No. 22', 'TVS Scooty Streak', 1, 3, 2, 1340.00, 'F-04', ''),
  ('K3170040', 'CABLE ASSY. SPEEDOMETER', 'Speedometer Assy.', 'FIG.No. 22', 'TVS Scooty Streak', 1, 16, 6, 165.00, 'F-04', 'Fast moving'),
  ('K3321450', 'TOP COVER SPEEDOMETER (SCREW TYPE)', 'Speedometer Assy.', 'FIG.No. 22', 'TVS Scooty Streak', 1, 6, 3, 285.00, 'F-04', ''),

  -- FIG.No. 23 & 24 - BODY PANELS & MUDGUARDS
  ('K3161200', 'TURN SIGNAL LAMP RH', 'Front & Rear Panel Assembly', 'FIG.No. 23', 'TVS Scooty Streak', 1, 7, 4, 340.00, 'G-01', ''),
  ('K3161190', 'TURN SIGNAL LAMP LH', 'Front & Rear Panel Assembly', 'FIG.No. 23', 'TVS Scooty Streak', 1, 6, 4, 340.00, 'G-01', ''),
  ('K3220400', 'PANEL REAR', 'Front & Rear Panel Assembly', 'FIG.No. 23', 'TVS Scooty Streak', 1, 3, 2, 780.00, 'G-01', ''),
  ('K3220490', 'MUDGUARD FRONT', 'Front & Rear Panel Assembly', 'FIG.No. 23', 'TVS Scooty Streak', 1, 5, 3, 640.00, 'G-01', ''),
  ('K3220470', 'UTILITY BOX', 'Panel Side LH, RH & Rear Mudguard', 'FIG.No. 24', 'TVS Scooty Streak', 1, 4, 2, 790.00, 'G-02', ''),
  ('K3220410', 'FLOOR BOARD', 'Panel Side LH, RH & Rear Mudguard', 'FIG.No. 24', 'TVS Scooty Streak', 1, 5, 3, 720.00, 'G-02', ''),
  ('K3220540', 'MUDGUARD REAR', 'Panel Side LH, RH & Rear Mudguard', 'FIG.No. 24', 'TVS Scooty Streak', 1, 6, 3, 460.00, 'G-02', ''),
  ('K3300030', 'SEAT LOCK', 'Panel Side LH, RH & Rear Mudguard', 'FIG.No. 24', 'TVS Scooty Streak', 1, 8, 4, 240.00, 'G-02', ''),

  -- FIG.No. 25 & 26 - WIRING HARNESS, BATTERY & TOOL KIT
  ('K3161240', 'WIRING HARNESS', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 4, 3, 1450.00, 'G-03', ''),
  ('K3160690', 'STARTER RELAY', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 14, 5, 210.00, 'G-03', 'Fast moving'),
  ('K3060590', 'REGULATOR CUM RECTIFIER', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 8, 4, 590.00, 'G-03', ''),
  ('K3160270', 'HORN ASSY.', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 12, 5, 245.00, 'G-03', ''),
  ('K06012000', 'BATTERY 12V 5AH', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 6, 4, 1350.00, 'G-04', 'Fast moving'),
  ('K3212000', 'LOCK SET', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 5, 3, 780.00, 'G-04', 'Not illustrated'),
  ('K3060470', 'COMBINED CDI TCU', 'Wiring Harness & Battery Assy.', 'FIG.No. 25', 'TVS Scooty Streak', 1, 0, 3, 1280.00, 'G-04', 'Out of stock'),
  ('K3210040', 'TOOL KIT COMPLETE', 'Tool Kit', 'FIG.No. 26', 'TVS Scooty Streak', 1, 9, 4, 320.00, 'G-05', 'Complete 7-piece kit')
ON CONFLICT (part_no) DO NOTHING;
