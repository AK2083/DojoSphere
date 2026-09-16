-- Port of V016__associations_seed_brandenburg.sql for Supabase/Postgres.
-- Converts SQLite integer booleans to boolean.


-- Kreisunion 1

INSERT INTO regional_federations (id, federation_id, name, short_name) VALUES
  (
    'd1000000-0000-4000-8000-000000000010',
    'd1000000-0000-4000-8000-000000000002',
    'Brandenburgischer Judo-Verband',
    'BJV'
  );

INSERT INTO districts (id, regional_federation_id, name, short_name, sort_order) VALUES
  (
    'd1000000-0000-4000-8000-000000000011',
    'd1000000-0000-4000-8000-000000000010',
    'Kreisunion 1',
    'KU1',
    1
  );

INSERT INTO associations (
  id, district_id, name, short_name, city, website, is_active, source
) VALUES
  (
    'a1010000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'PSG Dynamo Brandenburg-Mitte e.V. Abteilung Peter Kamraths Judo-Ligen',
    NULL,
    'Groß Kreutz',
    'https://www.pkjl-brandenburg.de',
    true,
    'djb-registry'
  ),
  (
    'a1020000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'Judoclub Bad Belzig 93 e.V.',
    NULL,
    'Bad Belzig',
    'https://www.judoclub-badbelzig.de',
    true,
    'djb-registry'
  ),
  (
    'a1030000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'Budokan Brandenburg e.V.',
    NULL,
    'Brandenburg',
    'https://www.budokan-brandenburg.de',
    true,
    'djb-registry'
  ),
  (
    'a1040000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'SG Einheit Wittstock e.V.',
    NULL,
    'Wittstock/Dosse',
    'https://www.wittstock.de/m/verzeichnis/visitenkarte.php?mandat=48360',
    true,
    'djb-registry'
  ),
  (
    'a1050000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'SV Pritzwalk 1911 e.V.',
    NULL,
    'Pritzwalk',
    'https://www.pritzwalker-sv.de/',
    true,
    'djb-registry'
  ),
  (
    'a1060000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'Rathenower JC 1961 e.V.',
    NULL,
    'Rathenow',
    'https://www.rathenower-jc.de/',
    true,
    'djb-registry'
  ),
  (
    'a1070000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'JSG Dynamo Jüterbog',
    NULL,
    'Jüterbog',
    'https://www.judoteam-jueterbog.de',
    true,
    'djb-registry'
  ),
  (
    'a1080000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'SV Blau-Weiß Perleberg',
    NULL,
    'Perleberg',
    'https://www.sv-blauweiss-perleberg.de/',
    true,
    'djb-registry'
  ),
  (
    'a1090000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'TSV Chemie Premnitz',
    NULL,
    'Premnitz',
    'https://www.judo-chemie-premnitz.de/',
    true,
    'djb-registry'
  ),
  (
    'a1110000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'Treuenbrietzener JV e.V.',
    NULL,
    'Treuenbrietzen',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a1130000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'SC Kempo Neuruppin e.V.',
    NULL,
    'Neuruppin',
    'https://www.sckempo-neuruppin.de',
    true,
    'djb-registry'
  ),
  (
    'a1140000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'JSH Golzow',
    NULL,
    'Golzow',
    'https://www.jsh-golzow.de/',
    true,
    'djb-registry'
  ),
  (
    'a1150000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'FSV Viktoria Brandenburg 1990 e.V.',
    NULL,
    'Brandenburg/OT Plaue',
    'https://www.viktoria-brandenburg.de',
    true,
    'djb-registry'
  ),
  (
    'a1180000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000011',
    'SV 90 Fehrbellin e.V. Sektion Kampfsport',
    NULL,
    'Lentzke',
    'https://www.sv90-fehrbellin.de/Kampfsport',
    true,
    'djb-registry'
  );

-- Amtsgerichts-Vereinsregisternummern (Kreisunion 1; soweit öffentlich belegt)
INSERT INTO association_identifiers (id, association_id, type, value, authority) VALUES
  ('a1010000-0000-4000-8000-000000000002', 'a1010000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 2876 P', 'Amtsgericht Potsdam'),
  ('a1020000-0000-4000-8000-000000000002', 'a1020000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 3738 P', 'Amtsgericht Potsdam'),
  ('a1030000-0000-4000-8000-000000000002', 'a1030000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 8032 P', 'Amtsgericht Potsdam'),
  ('a1040000-0000-4000-8000-000000000002', 'a1040000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 789 NP', 'Amtsgericht Neuruppin'),
  ('a1050000-0000-4000-8000-000000000002', 'a1050000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 2357 NP', 'Amtsgericht Neuruppin'),
  ('a1060000-0000-4000-8000-000000000002', 'a1060000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 5767 P', 'Amtsgericht Potsdam'),
  ('a1070000-0000-4000-8000-000000000002', 'a1070000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 6229 P', 'Amtsgericht Potsdam'),
  ('a1080000-0000-4000-8000-000000000002', 'a1080000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 1841 NP', 'Amtsgericht Neuruppin'),
  ('a1090000-0000-4000-8000-000000000002', 'a1090000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 5699 P', 'Amtsgericht Potsdam'),
  ('a1110000-0000-4000-8000-000000000002', 'a1110000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 3740 P', 'Amtsgericht Potsdam'),
  ('a1130000-0000-4000-8000-000000000002', 'a1130000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 172 NP', 'Amtsgericht Neuruppin'),
  ('a1140000-0000-4000-8000-000000000002', 'a1140000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 8817 P', 'Amtsgericht Potsdam'),
  ('a1150000-0000-4000-8000-000000000002', 'a1150000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 2927 P', 'Amtsgericht Potsdam'),
  ('a1180000-0000-4000-8000-000000000002', 'a1180000-0000-4000-8000-000000000001', 'vereinsregister_number', 'VR 109 NP', 'Amtsgericht Neuruppin');


INSERT INTO association_addresses (
  id, association_id, street, house_number, postal_code, city, country_code, address_type
) VALUES
  (
    'a1010000-0000-4000-8000-000000000003',
    'a1010000-0000-4000-8000-000000000001',
    'Trechwitzer Str.',
    '12',
    '14550',
    'Groß Kreutz',
    'DE',
    'primary'
  ),
  (
    'a1020000-0000-4000-8000-000000000003',
    'a1020000-0000-4000-8000-000000000001',
    'Am Bahnhof',
    '10',
    '14806',
    'Bad Belzig',
    'DE',
    'primary'
  ),
  (
    'a1030000-0000-4000-8000-000000000003',
    'a1030000-0000-4000-8000-000000000001',
    'Max-J.-Metzger Str.',
    '41',
    '14772',
    'Brandenburg',
    'DE',
    'primary'
  ),
  (
    'a1040000-0000-4000-8000-000000000003',
    'a1040000-0000-4000-8000-000000000001',
    'Pritzwalker Str.',
    '3',
    '16909',
    'Wittstock/Dosse',
    'DE',
    'primary'
  ),
  (
    'a1050000-0000-4000-8000-000000000003',
    'a1050000-0000-4000-8000-000000000001',
    'Falkenhagen',
    '9',
    '16928',
    'Pritzwalk',
    'DE',
    'primary'
  ),
  (
    'a1060000-0000-4000-8000-000000000003',
    'a1060000-0000-4000-8000-000000000001',
    'Rhinower Landstr.',
    '51',
    '14712',
    'Rathenow',
    'DE',
    'primary'
  ),
  (
    'a1080000-0000-4000-8000-000000000003',
    'a1080000-0000-4000-8000-000000000001',
    'Reetzer Str.',
    '45',
    '19384',
    'Perleberg',
    'DE',
    'primary'
  ),
  (
    'a1090000-0000-4000-8000-000000000003',
    'a1090000-0000-4000-8000-000000000001',
    'Fr.-Engels-Straße',
    '2',
    '14727',
    'Premnitz',
    'DE',
    'primary'
  ),
  (
    'a1110000-0000-4000-8000-000000000003',
    'a1110000-0000-4000-8000-000000000001',
    'Gertraudstr.',
    NULL,
    '14929',
    'Treuenbrietzen',
    'DE',
    'primary'
  ),
  (
    'a1130000-0000-4000-8000-000000000003',
    'a1130000-0000-4000-8000-000000000001',
    'Junckerstr.',
    '18d',
    '16816',
    'Neuruppin',
    'DE',
    'primary'
  ),
  (
    'a1140000-0000-4000-8000-000000000003',
    'a1140000-0000-4000-8000-000000000001',
    'Straße der Freundschaft',
    '2',
    '14778',
    'Golzow',
    'DE',
    'primary'
  ),
  (
    'a1150000-0000-4000-8000-000000000003',
    'a1150000-0000-4000-8000-000000000001',
    'Der Werder',
    '17',
    '14774',
    'Brandenburg/OT Plaue',
    'DE',
    'primary'
  ),
  (
    'a1180000-0000-4000-8000-000000000003',
    'a1180000-0000-4000-8000-000000000001',
    'Dorfstraße',
    '4',
    '16833',
    'Lentzke',
    'DE',
    'primary'
  );

INSERT INTO association_contacts (
  id, association_id, contact_type, value, label, is_public
) VALUES
  ('a1010000-0000-4000-8000-000000000004', 'a1010000-0000-4000-8000-000000000001', 'email', 'wzuckschwerdt@web.de', 'Abteilungsleiter Wolfgang Zuckschwerdt', true),
  ('a1010000-0000-4000-8000-000000000005', 'a1010000-0000-4000-8000-000000000001', 'phone', '+49 33207 51984', 'Telefon', false),
  ('a1010000-0000-4000-8000-000000000006', 'a1010000-0000-4000-8000-000000000001', 'fax', '+49 3381 524988', 'Fax', false),
  ('a1020000-0000-4000-8000-000000000004', 'a1020000-0000-4000-8000-000000000001', 'email', 'judoclub-badbelzig@t-online.de', 'Vorsitzender Mathias Köpping', true),
  ('a1020000-0000-4000-8000-000000000005', 'a1020000-0000-4000-8000-000000000001', 'phone', '+49 33841 34541', 'Telefon', false),
  ('a1020000-0000-4000-8000-000000000006', 'a1020000-0000-4000-8000-000000000001', 'phone', '+49 172 5396851', 'Mobil', false),
  ('a1020000-0000-4000-8000-000000000007', 'a1020000-0000-4000-8000-000000000001', 'fax', '+49 33843 30629', 'Fax', false),
  ('a1030000-0000-4000-8000-000000000004', 'a1030000-0000-4000-8000-000000000001', 'email', 'info@budokan-brandenburg.de', 'Vorstandsvorsitzender Wolfgang Link', true),
  ('a1030000-0000-4000-8000-000000000005', 'a1030000-0000-4000-8000-000000000001', 'email', 'vorstand@budokan-brandenburg.de', 'Vorstand', true),
  ('a1030000-0000-4000-8000-000000000006', 'a1030000-0000-4000-8000-000000000001', 'phone', '+49 3381 701707', 'Halle', false),
  ('a1030000-0000-4000-8000-000000000007', 'a1030000-0000-4000-8000-000000000001', 'phone', '+49 173 6269043', 'Mobil', false),
  ('a1040000-0000-4000-8000-000000000004', 'a1040000-0000-4000-8000-000000000001', 'email', 'Einheit-Wittstock@web.de', 'Vorsitzende Dana Hefenbrock', true),
  ('a1040000-0000-4000-8000-000000000005', 'a1040000-0000-4000-8000-000000000001', 'phone', '+49 162 2433239', 'Telefon', false),
  ('a1050000-0000-4000-8000-000000000004', 'a1050000-0000-4000-8000-000000000001', 'email', 'info@pritzwalk-sv.de', 'Abteilungsleiter Kai Neumann', true),
  ('a1050000-0000-4000-8000-000000000005', 'a1050000-0000-4000-8000-000000000001', 'phone', '+49 3395 304309', 'Telefon', false),
  ('a1060000-0000-4000-8000-000000000004', 'a1060000-0000-4000-8000-000000000001', 'email', 'mail@rjc-ev.de', 'Vorsitzender Ralf Kusch', true),
  ('a1060000-0000-4000-8000-000000000005', 'a1060000-0000-4000-8000-000000000001', 'phone', '+49 3385 503629', 'Telefon', false),
  ('a1060000-0000-4000-8000-000000000006', 'a1060000-0000-4000-8000-000000000001', 'phone', '+49 171 1512333', 'Mobil', false),
  ('a1060000-0000-4000-8000-000000000007', 'a1060000-0000-4000-8000-000000000001', 'fax', '+49 3385 5200030', 'Fax', false),
  ('a1070000-0000-4000-8000-000000000004', 'a1070000-0000-4000-8000-000000000001', 'email', 'vorstand@judoteam-jueterbog.de', '1. Vorsitzender Alexander Dehn', true),
  ('a1080000-0000-4000-8000-000000000004', 'a1080000-0000-4000-8000-000000000001', 'email', 'hartmut.voigt@freenet.de', 'Abteilungsleiter Hartmut Voigt', true),
  ('a1080000-0000-4000-8000-000000000005', 'a1080000-0000-4000-8000-000000000001', 'phone', '+49 3876 604447', 'Telefon', false),
  ('a1080000-0000-4000-8000-000000000006', 'a1080000-0000-4000-8000-000000000001', 'phone', '+49 172 3138401', 'Mobil', false),
  ('a1090000-0000-4000-8000-000000000004', 'a1090000-0000-4000-8000-000000000001', 'email', 'info@judodachse-premnitz.de', 'Abteilungsleiterin Judo Jacqueline Höhne', true),
  ('a1090000-0000-4000-8000-000000000005', 'a1090000-0000-4000-8000-000000000001', 'phone', '+49 3386 282011', 'Telefon', false),
  ('a1090000-0000-4000-8000-000000000006', 'a1090000-0000-4000-8000-000000000001', 'phone', '+49 160 7767994', 'Mobil', false),
  ('a1110000-0000-4000-8000-000000000004', 'a1110000-0000-4000-8000-000000000001', 'email', 'th.moeller@freenet.de', 'Vorsitzender Thomas Möller', true),
  ('a1110000-0000-4000-8000-000000000005', 'a1110000-0000-4000-8000-000000000001', 'phone', '+49 33748 79357', 'Telefon', false),
  ('a1110000-0000-4000-8000-000000000006', 'a1110000-0000-4000-8000-000000000001', 'fax', '+49 33748 79357', 'Fax', false),
  ('a1130000-0000-4000-8000-000000000004', 'a1130000-0000-4000-8000-000000000001', 'email', 'info@sckempo-neuruppin.de', 'Abteilungsleiter Bernd Pietsch', true),
  ('a1130000-0000-4000-8000-000000000005', 'a1130000-0000-4000-8000-000000000001', 'phone', '+49 3391 503474', 'Telefon', false),
  ('a1130000-0000-4000-8000-000000000006', 'a1130000-0000-4000-8000-000000000001', 'fax', '+49 3391 503477', 'Fax', false),
  ('a1140000-0000-4000-8000-000000000004', 'a1140000-0000-4000-8000-000000000001', 'email', 'h.hermann@jsh-golzow.de', 'Vorsitzender Heiko Hermann', true),
  ('a1140000-0000-4000-8000-000000000005', 'a1140000-0000-4000-8000-000000000001', 'phone', '+49 176 82152575', 'Telefon', false),
  ('a1150000-0000-4000-8000-000000000004', 'a1150000-0000-4000-8000-000000000001', 'email', 'FSV.Viktoria.Brandenburg@t-online.de', '1. Vorsitzender Lothar Müller', true),
  ('a1150000-0000-4000-8000-000000000005', 'a1150000-0000-4000-8000-000000000001', 'phone', '+49 3381 700702', 'Telefon', false),
  ('a1150000-0000-4000-8000-000000000006', 'a1150000-0000-4000-8000-000000000001', 'phone', '+49 175 6014036', 'Mobil', false),
  ('a1150000-0000-4000-8000-000000000007', 'a1150000-0000-4000-8000-000000000001', 'fax', '+49 3381 403477', 'Fax', false),
  ('a1180000-0000-4000-8000-000000000004', 'a1180000-0000-4000-8000-000000000001', 'email', 'kampfsport@sv90-fehrbellin.de', 'Verantwortlicher Judo Marcus Melzer / Post Wilfried Franke', true);

-- Kreisunion 2

INSERT INTO districts (id, regional_federation_id, name, short_name, sort_order) VALUES
  (
    'd1000000-0000-4000-8000-000000000012',
    'd1000000-0000-4000-8000-000000000010',
    'Kreisunion 2',
    'KU2',
    2
  );

INSERT INTO associations (
  id, district_id, name, short_name, city, website, is_active, source
) VALUES
  (
    'a2020000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'JC Samura Oranienburg',
    NULL,
    'Oranienburg',
    'https://www.judo-oranienburg.de',
    true,
    'djb-registry'
  ),
  (
    'a2030000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Judoschule Angermünde',
    NULL,
    'Angermünde',
    'https://www.judoschuleangermünde.de',
    true,
    'djb-registry'
  ),
  (
    'a2040000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Budowelt Fredersdorf-Vogelsdorf e.V.',
    NULL,
    NULL,
    'https://www.budowelt-fv.de',
    true,
    'djb-registry'
  ),
  (
    'a2050000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Bushido Wriezen e.V.',
    NULL,
    'Prötzel',
    'https://www.bushido-wriezen.de',
    true,
    'djb-registry'
  ),
  (
    'a2060000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'SG Rot-Weiß Neuenhagen',
    NULL,
    'Neuenhagen bei Berlin',
    'https://www.sg-rot-weiss-neuenhagen.de',
    true,
    'djb-registry'
  ),
  (
    'a2070000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'KSC Strausberg e.V.',
    NULL,
    'Strausberg',
    'https://www.ksc-judo.de',
    true,
    'djb-registry'
  ),
  (
    'a2080000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'JC Eberswalde',
    NULL,
    'Eberswalde',
    'https://www.judoclub-eberswalde.de',
    true,
    'djb-registry'
  ),
  (
    'a2090000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'PSV Templin e.V.',
    NULL,
    'Templin',
    'https://www.templin.de',
    true,
    'djb-registry'
  ),
  (
    'a2100000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Prenzlauer JSV e.V.',
    NULL,
    'Prenzlau',
    'https://www.judo-prenzlau.de',
    true,
    'djb-registry'
  ),
  (
    'a2110000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'SV Do-Keiko Freienwalde e.V.',
    NULL,
    'Altglietzen',
    'https://www.sv-do-keiko.de',
    true,
    'djb-registry'
  ),
  (
    'a2120000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'TSV Blau-Weiß Schwedt e.V.',
    NULL,
    'Berkholz-Meyenburg',
    'https://judo.blauweiss65-schwedt.de',
    true,
    'djb-registry'
  ),
  (
    'a2130000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Judo-Sportverein Bernau',
    NULL,
    'Bernau b. Berlin',
    'https://www.jsv-bernau.de',
    true,
    'djb-registry'
  ),
  (
    'a2170000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'SC Dynamo Hoppegarten',
    NULL,
    'Dahlwitz-Hoppegarten',
    'https://www.dynamo-hoppegarten.de',
    true,
    'djb-registry'
  ),
  (
    'a2180000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'SG Schildow e.V.',
    NULL,
    'Schildow',
    'https://www.sg-schildow.net',
    true,
    'djb-registry'
  ),
  (
    'a2190000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'PSV Basdorf e.V.',
    NULL,
    'Wandlitz',
    'https://www.psv-basdorf.de',
    true,
    'djb-registry'
  ),
  (
    'a2200000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Oranienburger Judo Club',
    NULL,
    'Neuholland',
    'https://www.OranienburgerJC.de',
    true,
    'djb-registry'
  ),
  (
    'a2230000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'SV Glück Auf Rüdersdorf',
    NULL,
    'Rüdersdorf',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a2240000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'SG Blau-Weiß Nassenheide',
    NULL,
    'Löwenberger Land, OT Nassenheide',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a2250000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000012',
    'Oberbarnimer Kur- und Wanderverein',
    NULL,
    'Bad Freienwalde',
    NULL,
    true,
    'djb-registry'
  );


INSERT INTO association_addresses (
  id, association_id, street, house_number, postal_code, city, country_code, address_type
) VALUES
  (
    'a2020000-0000-4000-8000-000000000003',
    'a2020000-0000-4000-8000-000000000001',
    'Kölner Str.',
    '10',
    '16515',
    'Oranienburg',
    'DE',
    'primary'
  ),
  (
    'a2030000-0000-4000-8000-000000000003',
    'a2030000-0000-4000-8000-000000000001',
    'Lindenhof',
    '9',
    '16278',
    'Angermünde',
    'DE',
    'primary'
  ),
  (
    'a2050000-0000-4000-8000-000000000003',
    'a2050000-0000-4000-8000-000000000001',
    'Strausberger Str.',
    '34',
    '15345',
    'Prötzel',
    'DE',
    'primary'
  ),
  (
    'a2060000-0000-4000-8000-000000000003',
    'a2060000-0000-4000-8000-000000000001',
    'Hildesheimer Str.',
    '14 a',
    '15366',
    'Neuenhagen bei Berlin',
    'DE',
    'primary'
  ),
  (
    'a2070000-0000-4000-8000-000000000003',
    'a2070000-0000-4000-8000-000000000001',
    'Am Sportpark',
    '7',
    '15344',
    'Strausberg',
    'DE',
    'primary'
  ),
  (
    'a2080000-0000-4000-8000-000000000003',
    'a2080000-0000-4000-8000-000000000001',
    'Heegermühlenstraße',
    '69',
    '16225',
    'Eberswalde',
    'DE',
    'primary'
  ),
  (
    'a2090000-0000-4000-8000-000000000003',
    'a2090000-0000-4000-8000-000000000001',
    'Fasanenstr.',
    '20',
    '17268',
    'Templin',
    'DE',
    'primary'
  ),
  (
    'a2100000-0000-4000-8000-000000000003',
    'a2100000-0000-4000-8000-000000000001',
    'Straße des Friedens',
    '19',
    '17291',
    'Prenzlau',
    'DE',
    'primary'
  ),
  (
    'a2110000-0000-4000-8000-000000000003',
    'a2110000-0000-4000-8000-000000000001',
    'Chausseestr.',
    '97',
    '16259',
    'Altglietzen',
    'DE',
    'primary'
  ),
  (
    'a2120000-0000-4000-8000-000000000003',
    'a2120000-0000-4000-8000-000000000001',
    'Am Mühlenberg',
    '51',
    '16303',
    'Berkholz-Meyenburg',
    'DE',
    'primary'
  ),
  (
    'a2130000-0000-4000-8000-000000000003',
    'a2130000-0000-4000-8000-000000000001',
    'Heinersdorfer Str.',
    '52',
    '16321',
    'Bernau b. Berlin',
    'DE',
    'primary'
  ),
  (
    'a2170000-0000-4000-8000-000000000003',
    'a2170000-0000-4000-8000-000000000001',
    'Lindenallee',
    '47',
    '15366',
    'Dahlwitz-Hoppegarten',
    'DE',
    'primary'
  ),
  (
    'a2180000-0000-4000-8000-000000000003',
    'a2180000-0000-4000-8000-000000000001',
    'Am Kienluchgraben',
    '14',
    '16552',
    'Schildow',
    'DE',
    'primary'
  ),
  (
    'a2190000-0000-4000-8000-000000000003',
    'a2190000-0000-4000-8000-000000000001',
    'Rene-Iskin-Ring',
    '4',
    '16348',
    'Wandlitz',
    'DE',
    'primary'
  ),
  (
    'a2200000-0000-4000-8000-000000000003',
    'a2200000-0000-4000-8000-000000000001',
    'Straße der Jugend',
    '20',
    '16559',
    'Neuholland',
    'DE',
    'primary'
  ),
  (
    'a2240000-0000-4000-8000-000000000003',
    'a2240000-0000-4000-8000-000000000001',
    'Am Waldsee',
    '45b',
    '16775',
    'Löwenberger Land, OT Nassenheide',
    'DE',
    'primary'
  ),
  (
    'a2250000-0000-4000-8000-000000000003',
    'a2250000-0000-4000-8000-000000000001',
    'Neukietz',
    '10',
    '16259',
    'Bad Freienwalde',
    'DE',
    'primary'
  );

INSERT INTO association_contacts (
  id, association_id, contact_type, value, label, is_public
) VALUES
  -- 2-02
  ('a2020000-0000-4000-8000-000000000004', 'a2020000-0000-4000-8000-000000000001', 'email', 'JC.Samura@web.de', 'Vorsitzender Christian Lambeck', true),
  ('a2020000-0000-4000-8000-000000000005', 'a2020000-0000-4000-8000-000000000001', 'phone', '+49 3301 524089', 'Telefon', false),
  -- 2-03
  ('a2030000-0000-4000-8000-000000000004', 'a2030000-0000-4000-8000-000000000001', 'email', 'kontakt@judoschuleangermünde.de', 'Vorsitzender Axel Metzdorf', true),
  ('a2030000-0000-4000-8000-000000000005', 'a2030000-0000-4000-8000-000000000001', 'phone', '+49 172 4447109', 'Telefon', false),
  -- 2-04 (no address published)
  ('a2040000-0000-4000-8000-000000000004', 'a2040000-0000-4000-8000-000000000001', 'email', 'info@budowelt-fv.de', 'Vorsitzender Thomas Petzoldt', true),
  ('a2040000-0000-4000-8000-000000000005', 'a2040000-0000-4000-8000-000000000001', 'phone', '+49 163 2541842', 'Telefon', false),
  -- 2-05
  ('a2050000-0000-4000-8000-000000000004', 'a2050000-0000-4000-8000-000000000001', 'email', 'HeikeSchmidt55@web.de', 'Vorsitzende Andrea Alt / Post Heike Schmidt', true),
  ('a2050000-0000-4000-8000-000000000005', 'a2050000-0000-4000-8000-000000000001', 'phone', '+49 174 3060690', 'Telefon', false),
  -- 2-06
  ('a2060000-0000-4000-8000-000000000004', 'a2060000-0000-4000-8000-000000000001', 'email', 'rw_nhg_jjj@web.de', 'Abteilungsleiter Dr. Sven von Ende', true),
  ('a2060000-0000-4000-8000-000000000005', 'a2060000-0000-4000-8000-000000000001', 'phone', '+49 1523 3611113', 'Telefon', false),
  -- 2-07
  ('a2070000-0000-4000-8000-000000000004', 'a2070000-0000-4000-8000-000000000001', 'email', 'ksc-judo@gmx.de', 'Vorsitzender Jürgen Teichmann', true),
  ('a2070000-0000-4000-8000-000000000005', 'a2070000-0000-4000-8000-000000000001', 'phone', '+49 3341 3563520', 'Telefon', false),
  ('a2070000-0000-4000-8000-000000000006', 'a2070000-0000-4000-8000-000000000001', 'fax', '+49 3341 3563521', 'Fax', false),
  -- 2-08
  ('a2080000-0000-4000-8000-000000000004', 'a2080000-0000-4000-8000-000000000001', 'email', 'kontakt@judoclub-eberswalde.de', 'Vorsitzender Ronald Kühn', true),
  ('a2080000-0000-4000-8000-000000000005', 'a2080000-0000-4000-8000-000000000001', 'phone', '+49 172 9055936', 'Telefon', false),
  -- 2-09
  ('a2090000-0000-4000-8000-000000000004', 'a2090000-0000-4000-8000-000000000001', 'email', 'schulz_falli@hotmail.de', 'Abteilungsleiter Fred Schulz', true),
  ('a2090000-0000-4000-8000-000000000005', 'a2090000-0000-4000-8000-000000000001', 'phone', '+49 3987 54420', 'Telefon', false),
  ('a2090000-0000-4000-8000-000000000006', 'a2090000-0000-4000-8000-000000000001', 'phone', '+49 3987 430', 'Telefon 2', false),
  -- 2-10
  ('a2100000-0000-4000-8000-000000000004', 'a2100000-0000-4000-8000-000000000001', 'email', 'judo-pz@t-online.de', 'Vorsitzender Jörg Brämer', true),
  ('a2100000-0000-4000-8000-000000000005', 'a2100000-0000-4000-8000-000000000001', 'phone', '+49 3984 3244845', 'Telefon', false),
  -- 2-11
  ('a2110000-0000-4000-8000-000000000004', 'a2110000-0000-4000-8000-000000000001', 'email', 'info@sv-do-keiko.de', 'Vorsitzender Stephan Rietz', true),
  ('a2110000-0000-4000-8000-000000000005', 'a2110000-0000-4000-8000-000000000001', 'phone', '+49 33456 155060', 'Telefon', false),
  ('a2110000-0000-4000-8000-000000000006', 'a2110000-0000-4000-8000-000000000001', 'fax', '+49 33456 155066', 'Fax', false),
  -- 2-12
  ('a2120000-0000-4000-8000-000000000004', 'a2120000-0000-4000-8000-000000000001', 'email', 'Volker.Erniks@hotmail.de', 'Vorsitzender Andrè Kielack / Post Volker Erniks', true),
  ('a2120000-0000-4000-8000-000000000005', 'a2120000-0000-4000-8000-000000000001', 'phone', '+49 172 9524994', 'Telefon', false),
  -- 2-13
  ('a2130000-0000-4000-8000-000000000004', 'a2130000-0000-4000-8000-000000000001', 'email', 'info@jsv-bernau.de', 'Vorsitzender Heiko Posselt', true),
  ('a2130000-0000-4000-8000-000000000005', 'a2130000-0000-4000-8000-000000000001', 'phone', '+49 3338 36787860', 'Telefon', false),
  -- 2-17
  ('a2170000-0000-4000-8000-000000000004', 'a2170000-0000-4000-8000-000000000001', 'email', 'budofreunde@web.de', 'Vorsitzender Volkmar Seidel', true),
  ('a2170000-0000-4000-8000-000000000005', 'a2170000-0000-4000-8000-000000000001', 'phone', '+49 3342 302035', 'Telefon', false),
  -- 2-18
  ('a2180000-0000-4000-8000-000000000004', 'a2180000-0000-4000-8000-000000000001', 'email', 'info@sg-schildow.net', 'Vorsitzender Ralph Kersten', true),
  ('a2180000-0000-4000-8000-000000000005', 'a2180000-0000-4000-8000-000000000001', 'phone', '+49 175 9688162', 'Telefon', false),
  -- 2-19
  ('a2190000-0000-4000-8000-000000000004', 'a2190000-0000-4000-8000-000000000001', 'email', 'geschaeftsstelle@psv-basdorf.de', 'Vorsitzender Michael Siebert', true),
  ('a2190000-0000-4000-8000-000000000005', 'a2190000-0000-4000-8000-000000000001', 'phone', '+49 160 95409591', 'Mobil', false),
  ('a2190000-0000-4000-8000-000000000006', 'a2190000-0000-4000-8000-000000000001', 'phone', '+49 3339 7600761', 'Festnetz', false),
  -- 2-20
  ('a2200000-0000-4000-8000-000000000004', 'a2200000-0000-4000-8000-000000000001', 'email', 'Judo-Team@Oranienburg.co', '2. Vorsitzender Manuel Latza', true),
  ('a2200000-0000-4000-8000-000000000005', 'a2200000-0000-4000-8000-000000000001', 'phone', '+49 162 3276963', 'Telefon', false),
  -- 2-23: name/number only (no published contacts)
  -- 2-24
  ('a2240000-0000-4000-8000-000000000004', 'a2240000-0000-4000-8000-000000000001', 'email', 'sg-blauweiss@t-online.de', 'Vorsitzende Eva Richter', true),
  ('a2240000-0000-4000-8000-000000000005', 'a2240000-0000-4000-8000-000000000001', 'phone', '+49 160 96555435', 'Telefon', false),
  -- 2-25
  ('a2250000-0000-4000-8000-000000000004', 'a2250000-0000-4000-8000-000000000001', 'email', 'renekeil79@web.de', 'Ansprechpartner René Keil', true),
  ('a2250000-0000-4000-8000-000000000005', 'a2250000-0000-4000-8000-000000000001', 'phone', '+49 173 4140350', 'Telefon', false);

-- Kreisunion 3

INSERT INTO districts (id, regional_federation_id, name, short_name, sort_order) VALUES
  (
    'd1000000-0000-4000-8000-000000000013',
    'd1000000-0000-4000-8000-000000000010',
    'Kreisunion 3',
    'KU3',
    3
  );

INSERT INTO associations (
  id, district_id, name, short_name, city, website, is_active, source
) VALUES
  (
    'a3010000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'RSV Eintracht 1949 e.V.',
    NULL,
    'Berlin',
    'https://www.rsv-eintracht1949.de',
    true,
    'djb-registry'
  ),
  (
    'a3020000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Judoschule Falkensee',
    NULL,
    'Falkensee',
    'https://www.judoschule-falkensee.de',
    true,
    'djb-registry'
  ),
  (
    'a3030000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'PSV Zossen e.V.',
    NULL,
    'Blankenfelde',
    'https://www.judo-psvzossen.de',
    true,
    'djb-registry'
  ),
  (
    'a3040000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Bushido Luckenwalde',
    NULL,
    'Trebbin',
    'https://www.bushido-luckenwalde.de',
    true,
    'djb-registry'
  ),
  (
    'a3050000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'UJKC Potsdam e.V.',
    NULL,
    'Potsdam',
    'https://www.ujkc.de',
    true,
    'djb-registry'
  ),
  (
    'a3060000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Hennigsdorfer JV e.V.',
    NULL,
    'Hennigsdorf',
    'https://www.hennigsdorfer-judo-verein.de',
    true,
    'djb-registry'
  ),
  (
    'a3070000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'SV Motor Babelsberg e.V.',
    NULL,
    'Potsdam',
    'https://www.sv-motor-babelsberg.de/judo/',
    true,
    'djb-registry'
  ),
  (
    'a3080000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'USV Potsdam',
    NULL,
    'Potsdam',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a3090000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'JV Ludwigsfelde e.V.',
    NULL,
    'Trebbin, OT Löwendorf',
    'https://www.judo-ludwigsfelde.de',
    true,
    'djb-registry'
  ),
  (
    'a3100000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'JV Königs Wusterhausen/Zernsdorf',
    NULL,
    'Königs Wusterhausen',
    'https://www.judoverein-kw.de',
    true,
    'djb-registry'
  ),
  (
    'a3110000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Uebigauer Sport-Bund',
    NULL,
    'Uebigau',
    'https://www.judo-uebigau.de',
    true,
    'djb-registry'
  ),
  (
    'a3120000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Judoverein Ippon Kirchhain/Finsterwalde e.V.',
    NULL,
    'Finsterwalde',
    'https://www.judoverein-ippon.de',
    true,
    'djb-registry'
  ),
  (
    'a3130000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Budokan Herzberg/Elster e.V.',
    NULL,
    'Schlieben',
    'https://www.budokan-herzberg.de.tl',
    true,
    'djb-registry'
  ),
  (
    'a3140000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'JV Blankenfelde-Mahlow',
    NULL,
    'Blankenfelde-Mahlow',
    'https://www.jvmahlow.de',
    true,
    'djb-registry'
  ),
  (
    'a3150000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Judo-Elche Schönwalde-Glien 04 e.V.',
    NULL,
    'Falkensee',
    'https://www.judoelche.de',
    true,
    'djb-registry'
  ),
  (
    'a3160000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Judoteam Lok Zernsdorf 1967 e.V.',
    NULL,
    'Zernsdorf',
    'https://www.judoteam-zernsdorf.de',
    true,
    'djb-registry'
  ),
  (
    'a3180000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Judo/Ju-Jutsu Asahi Sonnewalde',
    NULL,
    'Sonnewalde',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a3190000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Brieselanger Miniathleten e.V.',
    NULL,
    'Brieselang',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a3200000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'Judo-Club Großbeeren e.V.',
    NULL,
    'Großbeeren',
    'https://www.judoclubgrossbeeren.de',
    true,
    'djb-registry'
  ),
  (
    'a3210000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'SG Geltow',
    NULL,
    'Schwielowsee OT Geltow',
    'https://www.sg-geltow.de',
    true,
    'djb-registry'
  ),
  (
    'a3220000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000013',
    'KSV Tai no Sen e.V.',
    NULL,
    'Brieselang, OT Zeestow',
    NULL,
    true,
    'djb-registry'
  );


INSERT INTO association_addresses (
  id, association_id, street, house_number, postal_code, city, country_code, address_type
) VALUES
  (
    'a3010000-0000-4000-8000-000000000003',
    'a3010000-0000-4000-8000-000000000001',
    'Prinzenstraße',
    '4',
    '12207',
    'Berlin',
    'DE',
    'primary'
  ),
  (
    'a3020000-0000-4000-8000-000000000003',
    'a3020000-0000-4000-8000-000000000001',
    'K.-Kollwitz-Str.',
    '55',
    '14612',
    'Falkensee',
    'DE',
    'primary'
  ),
  (
    'a3030000-0000-4000-8000-000000000003',
    'a3030000-0000-4000-8000-000000000001',
    'Käthe-Kollwitz-Str.',
    '11D',
    '15827',
    'Blankenfelde',
    'DE',
    'primary'
  ),
  (
    'a3040000-0000-4000-8000-000000000003',
    'a3040000-0000-4000-8000-000000000001',
    'Burggrafenstraße',
    '51a',
    '14959',
    'Trebbin',
    'DE',
    'primary'
  ),
  (
    'a3050000-0000-4000-8000-000000000003',
    'a3050000-0000-4000-8000-000000000001',
    'Olympischer Weg',
    '2, MBS-Arena',
    '14471',
    'Potsdam',
    'DE',
    'primary'
  ),
  (
    'a3060000-0000-4000-8000-000000000003',
    'a3060000-0000-4000-8000-000000000001',
    'Waidmannsweg',
    '10a',
    '16761',
    'Hennigsdorf',
    'DE',
    'primary'
  ),
  (
    'a3070000-0000-4000-8000-000000000003',
    'a3070000-0000-4000-8000-000000000001',
    'Konsumhof',
    '1',
    '14482',
    'Potsdam',
    'DE',
    'primary'
  ),
  (
    'a3080000-0000-4000-8000-000000000003',
    'a3080000-0000-4000-8000-000000000001',
    'Am Neuen Palais',
    '10',
    '14469',
    'Potsdam',
    'DE',
    'primary'
  ),
  (
    'a3090000-0000-4000-8000-000000000003',
    'a3090000-0000-4000-8000-000000000001',
    'An den Sümpfen',
    '19',
    '14959',
    'Trebbin, OT Löwendorf',
    'DE',
    'primary'
  ),
  (
    'a3100000-0000-4000-8000-000000000003',
    'a3100000-0000-4000-8000-000000000001',
    'Goethestr.',
    '6',
    '15711',
    'Königs Wusterhausen',
    'DE',
    'primary'
  ),
  (
    'a3110000-0000-4000-8000-000000000003',
    'a3110000-0000-4000-8000-000000000001',
    'Ringstr.',
    '50',
    '04938',
    'Uebigau',
    'DE',
    'primary'
  ),
  (
    'a3120000-0000-4000-8000-000000000003',
    'a3120000-0000-4000-8000-000000000001',
    'Am Langen Hacken',
    '56',
    '03238',
    'Finsterwalde',
    'DE',
    'primary'
  ),
  (
    'a3130000-0000-4000-8000-000000000003',
    'a3130000-0000-4000-8000-000000000001',
    'Ernst Thälmann-Straße',
    '22',
    '04936',
    'Schlieben',
    'DE',
    'primary'
  ),
  (
    'a3140000-0000-4000-8000-000000000003',
    'a3140000-0000-4000-8000-000000000001',
    'Mahlower Str.',
    '59',
    '15831',
    'Blankenfelde-Mahlow',
    'DE',
    'primary'
  ),
  (
    'a3150000-0000-4000-8000-000000000003',
    'a3150000-0000-4000-8000-000000000001',
    'Liebenwalder Str.',
    '7',
    '14612',
    'Falkensee',
    'DE',
    'primary'
  ),
  (
    'a3160000-0000-4000-8000-000000000003',
    'a3160000-0000-4000-8000-000000000001',
    'Seestr.',
    '6',
    '15712',
    'Zernsdorf',
    'DE',
    'primary'
  ),
  (
    'a3180000-0000-4000-8000-000000000003',
    'a3180000-0000-4000-8000-000000000001',
    'An der MTS',
    '14a',
    '03249',
    'Sonnewalde',
    'DE',
    'primary'
  ),
  (
    'a3190000-0000-4000-8000-000000000003',
    'a3190000-0000-4000-8000-000000000001',
    'Blumensteg',
    '9b',
    '14656',
    'Brieselang',
    'DE',
    'primary'
  ),
  (
    'a3200000-0000-4000-8000-000000000003',
    'a3200000-0000-4000-8000-000000000001',
    'Ruhlsdorfer Straße',
    '3b',
    '14979',
    'Großbeeren',
    'DE',
    'primary'
  ),
  (
    'a3210000-0000-4000-8000-000000000003',
    'a3210000-0000-4000-8000-000000000001',
    'Am Wasser',
    '3',
    '14548',
    'Schwielowsee OT Geltow',
    'DE',
    'primary'
  ),
  (
    'a3220000-0000-4000-8000-000000000003',
    'a3220000-0000-4000-8000-000000000001',
    'Bredower Str.',
    '8k',
    '14656',
    'Brieselang, OT Zeestow',
    'DE',
    'primary'
  );

INSERT INTO association_contacts (
  id, association_id, contact_type, value, label, is_public
) VALUES
  -- 3-01
  ('a3010000-0000-4000-8000-000000000004', 'a3010000-0000-4000-8000-000000000001', 'email', 'sdrews2@web.de', 'Vorsitzender Stefan Drews', true),
  ('a3010000-0000-4000-8000-000000000005', 'a3010000-0000-4000-8000-000000000001', 'phone', '+49 151 26950584', 'Telefon', false),
  -- 3-02
  ('a3020000-0000-4000-8000-000000000004', 'a3020000-0000-4000-8000-000000000001', 'email', 'info@judoschule-falkensee.de', 'Vorsitzende Yvonne Nowakowski', true),
  ('a3020000-0000-4000-8000-000000000005', 'a3020000-0000-4000-8000-000000000001', 'phone', '+49 3322 242311', 'Telefon', false),
  ('a3020000-0000-4000-8000-000000000006', 'a3020000-0000-4000-8000-000000000001', 'fax', '+49 3322 242311', 'Fax', false),
  -- 3-03
  ('a3030000-0000-4000-8000-000000000004', 'a3030000-0000-4000-8000-000000000001', 'email', 'marioburowjudo@googlemail.com', 'Abteilungsleiter Mario Burow', true),
  ('a3030000-0000-4000-8000-000000000005', 'a3030000-0000-4000-8000-000000000001', 'phone', '+49 3379 38925', 'Privat', false),
  ('a3030000-0000-4000-8000-000000000006', 'a3030000-0000-4000-8000-000000000001', 'phone', '+49 174 8519191', 'Dienstlich', false),
  -- 3-04
  ('a3040000-0000-4000-8000-000000000004', 'a3040000-0000-4000-8000-000000000001', 'email', 'info@bushido-luckenwalde.de', '2. Vorsitzender Andre Hintzen', true),
  ('a3040000-0000-4000-8000-000000000005', 'a3040000-0000-4000-8000-000000000001', 'phone', '+49 172 6983976', 'Telefon', false),
  -- 3-05
  ('a3050000-0000-4000-8000-000000000004', 'a3050000-0000-4000-8000-000000000001', 'email', 'info@ujkc.de', 'Präsident Dr. Helmar Hentschke', true),
  ('a3050000-0000-4000-8000-000000000005', 'a3050000-0000-4000-8000-000000000001', 'phone', '+49 331 9512905', 'Telefon', false),
  ('a3050000-0000-4000-8000-000000000006', 'a3050000-0000-4000-8000-000000000001', 'fax', '+49 331 9792257', 'Fax', false),
  -- 3-06
  ('a3060000-0000-4000-8000-000000000004', 'a3060000-0000-4000-8000-000000000001', 'email', 'vorstand@hennigsdorfer-judo-verein.de', 'Vorsitzender Jörg Schnelle', true),
  ('a3060000-0000-4000-8000-000000000005', 'a3060000-0000-4000-8000-000000000001', 'phone', '+49 3302 493753', 'Telefon', false),
  ('a3060000-0000-4000-8000-000000000006', 'a3060000-0000-4000-8000-000000000001', 'fax', '+49 3302 493753', 'Fax', false),
  -- 3-07
  ('a3070000-0000-4000-8000-000000000004', 'a3070000-0000-4000-8000-000000000001', 'email', 'info@judo.sv-motor-babelsberg.de', 'Abteilungsleiter Manuel Gluske', true),
  ('a3070000-0000-4000-8000-000000000005', 'a3070000-0000-4000-8000-000000000001', 'phone', '+49 331 74001376', 'Telefon', false),
  -- 3-08
  ('a3080000-0000-4000-8000-000000000004', 'a3080000-0000-4000-8000-000000000001', 'email', 'hanke@uni-potsdam.de', 'Ansprechpartner Steffen Hanke / Vorsitzender Prof. Dr. Dieter Wagner', true),
  ('a3080000-0000-4000-8000-000000000005', 'a3080000-0000-4000-8000-000000000001', 'phone', '+49 177 4132710', 'Telefon', false),
  -- 3-09
  ('a3090000-0000-4000-8000-000000000004', 'a3090000-0000-4000-8000-000000000001', 'email', 'jvl@judo-ludwigsfelde.de', 'Vorsitzender Axel Schulz', true),
  ('a3090000-0000-4000-8000-000000000005', 'a3090000-0000-4000-8000-000000000001', 'phone', '+49 33731 17901', 'Telefon', false),
  ('a3090000-0000-4000-8000-000000000006', 'a3090000-0000-4000-8000-000000000001', 'phone', '+49 177 8884460', 'Mobil', false),
  ('a3090000-0000-4000-8000-000000000007', 'a3090000-0000-4000-8000-000000000001', 'fax', '+49 33731 31188', 'Fax', false),
  -- 3-10
  ('a3100000-0000-4000-8000-000000000004', 'a3100000-0000-4000-8000-000000000001', 'email', 'info@judoverein-kw.de', 'Vorsitzender Steffen Huth', true),
  ('a3100000-0000-4000-8000-000000000005', 'a3100000-0000-4000-8000-000000000001', 'phone', '+49 3375 294720', 'Telefon', false),
  ('a3100000-0000-4000-8000-000000000006', 'a3100000-0000-4000-8000-000000000001', 'fax', '+49 3375 213313', 'Fax', false),
  -- 3-11
  ('a3110000-0000-4000-8000-000000000004', 'a3110000-0000-4000-8000-000000000001', 'email', 's.knisse@freenet.de', 'Vorsitzender Reinhard Knisse', true),
  ('a3110000-0000-4000-8000-000000000005', 'a3110000-0000-4000-8000-000000000001', 'phone', '+49 35365 8341', 'Telefon', false),
  ('a3110000-0000-4000-8000-000000000006', 'a3110000-0000-4000-8000-000000000001', 'phone', '+49 160 7179520', 'Mobil', false),
  -- 3-12
  ('a3120000-0000-4000-8000-000000000004', 'a3120000-0000-4000-8000-000000000001', 'email', 'Judoverein_Ippon@web.de', 'Vorsitzender Alexej Schneider / Kontakt André Lichan', true),
  ('a3120000-0000-4000-8000-000000000005', 'a3120000-0000-4000-8000-000000000001', 'phone', '+49 3531 602134', 'Telefon', false),
  -- 3-13
  ('a3130000-0000-4000-8000-000000000004', 'a3130000-0000-4000-8000-000000000001', 'email', 'Ronny_Drasdo@web.de', 'Vorsitzende Petjana Schünke / Post Ronny Drasdo', true),
  ('a3130000-0000-4000-8000-000000000005', 'a3130000-0000-4000-8000-000000000001', 'phone', '+49 174 3804425', 'Telefon', false),
  -- 3-14
  ('a3140000-0000-4000-8000-000000000004', 'a3140000-0000-4000-8000-000000000001', 'email', 'jvmahlow@gmail.com', 'Vorsitzender Wolfgang Huth', true),
  ('a3140000-0000-4000-8000-000000000005', 'a3140000-0000-4000-8000-000000000001', 'phone', '+49 173 6231861', 'Telefon', false),
  -- 3-15
  ('a3150000-0000-4000-8000-000000000004', 'a3150000-0000-4000-8000-000000000001', 'email', 'judo-elche@gmx.de', 'Abteilungsleiterin Sylvia Damm', true),
  ('a3150000-0000-4000-8000-000000000005', 'a3150000-0000-4000-8000-000000000001', 'phone', '+49 3322 2866354', 'Telefon', false),
  ('a3150000-0000-4000-8000-000000000006', 'a3150000-0000-4000-8000-000000000001', 'phone', '+49 173 2343760', 'Mobil', false),
  -- 3-16
  ('a3160000-0000-4000-8000-000000000004', 'a3160000-0000-4000-8000-000000000001', 'email', 'verein@judoteam-zernsdorf.de', 'Vorsitzender Steffen Engelhardt', true),
  -- 3-18 (PLZ 0349 korrigiert zu 03249)
  ('a3180000-0000-4000-8000-000000000004', 'a3180000-0000-4000-8000-000000000001', 'email', 'oleg66@freenet.de', 'Abteilungsleiter Thomas Müller', true),
  ('a3180000-0000-4000-8000-000000000005', 'a3180000-0000-4000-8000-000000000001', 'phone', '+49 35323 60942', 'Telefon', false),
  ('a3180000-0000-4000-8000-000000000006', 'a3180000-0000-4000-8000-000000000001', 'phone', '+49 174 3190984', 'Mobil', false),
  -- 3-19
  ('a3190000-0000-4000-8000-000000000004', 'a3190000-0000-4000-8000-000000000001', 'email', 'andreas.senger1@freenet.de', 'Vorsitzender Andreas Senger', true),
  ('a3190000-0000-4000-8000-000000000005', 'a3190000-0000-4000-8000-000000000001', 'phone', '+49 33232 36923', 'Telefon', false),
  -- 3-20
  ('a3200000-0000-4000-8000-000000000004', 'a3200000-0000-4000-8000-000000000001', 'email', 'enrico.wilscher@judoclubgrossbeeren.de', 'Vorsitzender Enrico Willscher', true),
  -- 3-21
  ('a3210000-0000-4000-8000-000000000004', 'a3210000-0000-4000-8000-000000000001', 'email', 'judo@sg-geltow.de', 'Vorsitzender Jörg Steinbach', true),
  ('a3210000-0000-4000-8000-000000000005', 'a3210000-0000-4000-8000-000000000001', 'phone', '+49 3327 4882448', 'Telefon', false),
  -- 3-22
  ('a3220000-0000-4000-8000-000000000004', 'a3220000-0000-4000-8000-000000000001', 'email', 'ksvtainosen@gmail.com', 'Vorsitzender Philip Klöcking', true),
  ('a3220000-0000-4000-8000-000000000005', 'a3220000-0000-4000-8000-000000000001', 'phone', '+49 176 83890252', 'Telefon', false);

-- Kreisunion 4

INSERT INTO districts (id, regional_federation_id, name, short_name, sort_order) VALUES
  (
    'd1000000-0000-4000-8000-000000000014',
    'd1000000-0000-4000-8000-000000000010',
    'Kreisunion 4',
    'KU4',
    4
  );

INSERT INTO associations (
  id, district_id, name, short_name, city, website, is_active, source
) VALUES
  (
    'a4010000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'BSG Stahl Eisenhüttenstadt',
    NULL,
    'Vogelsang',
    NULL,
    true,
    'djb-registry'
  ),
  (
    'a4020000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'JC 90 Frankfurt (Oder)',
    NULL,
    'Frankfurt (Oder)',
    'https://www.judoclub90.de',
    true,
    'djb-registry'
  ),
  (
    'a4030000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'PSV Fürstenwalde',
    NULL,
    'Fürstenwalde',
    'https://www.psv-fuerstenwalde.de',
    true,
    'djb-registry'
  ),
  (
    'a4040000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'SG Chemie Erkner e.V. – Abt. Budo',
    NULL,
    'Neuenhagen',
    'https://www.sg-chemie-erkner.de',
    true,
    'djb-registry'
  ),
  (
    'a4050000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    '1. Spremberger Gesundheits-Sportverein e.V. Sakura',
    NULL,
    'Spremberg',
    'https://www.sakura-spremberg.de',
    true,
    'djb-registry'
  ),
  (
    'a4060000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'PSV Cottbus e.V.',
    NULL,
    'Cottbus',
    'https://www.psvcottbus-judo.de',
    true,
    'djb-registry'
  ),
  (
    'a4070000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'PSV Senftenberg',
    NULL,
    'Senftenberg',
    'https://www.psv-senftenberg-judo.de',
    true,
    'djb-registry'
  ),
  (
    'a4080000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'TSV Empor Dahme',
    NULL,
    'Dahme',
    'https://www.tsv-empor-dahme.de',
    true,
    'djb-registry'
  ),
  (
    'a4090000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'Polizeisportverein Frankfurt (Oder)',
    NULL,
    'Frankfurt (Oder)',
    'https://www.judo-ffo.de',
    true,
    'djb-registry'
  ),
  (
    'a4100000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'Budosport Schwarzheide',
    NULL,
    'Schwarzheide',
    'https://www.budosport-schwarzheide.de',
    true,
    'djb-registry'
  ),
  (
    'a4110000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'Budo-Dojo Fürstenwalde',
    NULL,
    'Fürstenwalde',
    'https://www.budo-dojo.de',
    true,
    'djb-registry'
  ),
  (
    'a4120000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'BV Lauchhammer',
    NULL,
    'Lauchhammer/OT Grünwalde',
    'https://www.budoverein-lauchhammer.de',
    true,
    'djb-registry'
  ),
  (
    'a4140000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'HSV Cottbus',
    NULL,
    'Cottbus',
    'https://www.hsvcottbus-judo.de',
    true,
    'djb-registry'
  ),
  (
    'a4150000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'JC Großräschen',
    NULL,
    'Neupetershain',
    'https://www.judo-grossraschen.de.tl',
    true,
    'djb-registry'
  ),
  (
    'a4160000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'JC Kyoko Jänschwalde',
    NULL,
    'Jänschwalde',
    'https://www.kyoko-judo.de',
    true,
    'djb-registry'
  ),
  (
    'a4170000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'JC „Kuzushi“ e.V. Lübben',
    NULL,
    'Lübben',
    'https://www.judo-lübben.de',
    true,
    'djb-registry'
  ),
  (
    'a4180000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'KSC Asahi Spremberg',
    NULL,
    'Spremberg',
    'https://www.ksc-asahi.de',
    true,
    'djb-registry'
  ),
  (
    'a4200000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'JV Neu Zittau',
    NULL,
    'Gosen-Neu Zittau',
    'https://www.judo-neuzittau.de',
    true,
    'djb-registry'
  ),
  (
    'a4230000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'SpVgg. Blau-Weiß 90 e.V. Vetschau',
    NULL,
    'Vetschau',
    'https://www.judo-vetschau.de',
    true,
    'djb-registry'
  ),
  (
    'a4260000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'TSG Lübbenau 63 e.V. – JC Nippon 75',
    NULL,
    'Luckau',
    'https://www.judo-tsgluebbenau.de.tl',
    true,
    'djb-registry'
  ),
  (
    'a4270000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000014',
    'Sakura Senftenberg',
    NULL,
    'Senftenberg',
    'https://www.sakura-fitness.de',
    true,
    'djb-registry'
  );


INSERT INTO association_addresses (
  id, association_id, street, house_number, postal_code, city, country_code, address_type
) VALUES
  (
    'a4010000-0000-4000-8000-000000000003',
    'a4010000-0000-4000-8000-000000000001',
    'Hauptstraße',
    '70',
    '15890',
    'Vogelsang',
    'DE',
    'primary'
  ),
  (
    'a4020000-0000-4000-8000-000000000003',
    'a4020000-0000-4000-8000-000000000001',
    'Stendaler Str.',
    '26',
    '15234',
    'Frankfurt (Oder)',
    'DE',
    'primary'
  ),
  (
    'a4030000-0000-4000-8000-000000000003',
    'a4030000-0000-4000-8000-000000000001',
    'Grünstraße',
    '10',
    '15517',
    'Fürstenwalde',
    'DE',
    'primary'
  ),
  (
    'a4040000-0000-4000-8000-000000000003',
    'a4040000-0000-4000-8000-000000000001',
    'Edelweißstraße',
    '10',
    '15366',
    'Neuenhagen',
    'DE',
    'primary'
  ),
  (
    'a4050000-0000-4000-8000-000000000003',
    'a4050000-0000-4000-8000-000000000001',
    'Schäfereiweg',
    '52',
    '03130',
    'Spremberg',
    'DE',
    'primary'
  ),
  (
    'a4060000-0000-4000-8000-000000000003',
    'a4060000-0000-4000-8000-000000000001',
    'Ostrower Damm',
    '11D',
    '03046',
    'Cottbus',
    'DE',
    'primary'
  ),
  (
    'a4070000-0000-4000-8000-000000000003',
    'a4070000-0000-4000-8000-000000000001',
    'Am Eisenwerk',
    '7',
    '01968',
    'Senftenberg',
    'DE',
    'primary'
  ),
  (
    'a4070000-0000-4000-8000-000000000008',
    'a4070000-0000-4000-8000-000000000001',
    'Steigerstr.',
    '23',
    '01968',
    'Senftenberg',
    'DE',
    'training'
  ),
  (
    'a4080000-0000-4000-8000-000000000003',
    'a4080000-0000-4000-8000-000000000001',
    'Luckauer Chaussee',
    '18',
    '15936',
    'Dahme',
    'DE',
    'primary'
  ),
  (
    'a4090000-0000-4000-8000-000000000003',
    'a4090000-0000-4000-8000-000000000001',
    'Kopernikusstraße',
    '71-75',
    '15236',
    'Frankfurt (Oder)',
    'DE',
    'primary'
  ),
  (
    'a4100000-0000-4000-8000-000000000003',
    'a4100000-0000-4000-8000-000000000001',
    'Dorfplatz',
    '18a',
    '01987',
    'Schwarzheide',
    'DE',
    'primary'
  ),
  (
    'a4110000-0000-4000-8000-000000000003',
    'a4110000-0000-4000-8000-000000000001',
    'K.-Kollwitz-Str.',
    '12',
    '15517',
    'Fürstenwalde',
    'DE',
    'primary'
  ),
  (
    'a4120000-0000-4000-8000-000000000003',
    'a4120000-0000-4000-8000-000000000001',
    'Quergasse',
    '1a',
    '01979',
    'Lauchhammer/OT Grünwalde',
    'DE',
    'primary'
  ),
  (
    'a4140000-0000-4000-8000-000000000003',
    'a4140000-0000-4000-8000-000000000001',
    'August-Bebel-Str.',
    '75',
    '03046',
    'Cottbus',
    'DE',
    'primary'
  ),
  (
    'a4150000-0000-4000-8000-000000000003',
    'a4150000-0000-4000-8000-000000000001',
    'Friedhofweg',
    '9',
    '03103',
    'Neupetershain',
    'DE',
    'primary'
  ),
  (
    'a4160000-0000-4000-8000-000000000003',
    'a4160000-0000-4000-8000-000000000001',
    'Eichenallee',
    '51',
    '03197',
    'Jänschwalde',
    'DE',
    'primary'
  ),
  (
    'a4160000-0000-4000-8000-000000000008',
    'a4160000-0000-4000-8000-000000000001',
    'Schillerstraße',
    '44',
    '03046',
    'Cottbus',
    'DE',
    'billing'
  ),
  (
    'a4170000-0000-4000-8000-000000000003',
    'a4170000-0000-4000-8000-000000000001',
    'G.-Keller-Str.',
    '34',
    '15907',
    'Lübben',
    'DE',
    'primary'
  ),
  (
    'a4180000-0000-4000-8000-000000000003',
    'a4180000-0000-4000-8000-000000000001',
    'Puschkinplatz',
    '1a',
    '03130',
    'Spremberg',
    'DE',
    'primary'
  ),
  (
    'a4200000-0000-4000-8000-000000000003',
    'a4200000-0000-4000-8000-000000000001',
    'Geschwister-Scholl-Str.',
    '45a',
    '15537',
    'Gosen-Neu Zittau',
    'DE',
    'primary'
  ),
  (
    'a4230000-0000-4000-8000-000000000003',
    'a4230000-0000-4000-8000-000000000001',
    'Kleine Bahnhofsstr.',
    '9',
    '03226',
    'Vetschau',
    'DE',
    'primary'
  ),
  (
    'a4260000-0000-4000-8000-000000000003',
    'a4260000-0000-4000-8000-000000000001',
    'Nordpromenade',
    '16',
    '15926',
    'Luckau',
    'DE',
    'primary'
  ),
  (
    'a4270000-0000-4000-8000-000000000003',
    'a4270000-0000-4000-8000-000000000001',
    'Hörlitzer Str.',
    '32',
    '01968',
    'Senftenberg',
    'DE',
    'primary'
  );

INSERT INTO association_contacts (
  id, association_id, contact_type, value, label, is_public
) VALUES
  ('a4010000-0000-4000-8000-000000000004', 'a4010000-0000-4000-8000-000000000001', 'email', 'heiko.weigert@web.de', 'Abteilungsleiter Heiko Weigert', true),
  ('a4010000-0000-4000-8000-000000000005', 'a4010000-0000-4000-8000-000000000001', 'phone', '+49 170 6376202', 'Telefon', false),
  ('a4020000-0000-4000-8000-000000000004', 'a4020000-0000-4000-8000-000000000001', 'email', 'info@judoclub90.de', 'Präsident Stephan Wall', true),
  ('a4020000-0000-4000-8000-000000000005', 'a4020000-0000-4000-8000-000000000001', 'phone', '+49 335 65488', 'Telefon', false),
  ('a4030000-0000-4000-8000-000000000004', 'a4030000-0000-4000-8000-000000000001', 'email', 'psv-fuerstenwalde@freenet.de', 'Vorsitzender Ralf Sicker', true),
  ('a4030000-0000-4000-8000-000000000005', 'a4030000-0000-4000-8000-000000000001', 'phone', '+49 172 3106124', 'Telefon', false),
  ('a4040000-0000-4000-8000-000000000004', 'a4040000-0000-4000-8000-000000000001', 'email', 'bluefighter@web.de', 'Abteilungsleiter Stefan Heinze', true),
  ('a4040000-0000-4000-8000-000000000005', 'a4040000-0000-4000-8000-000000000001', 'phone', '+49 151 52095339', 'Telefon', false),
  ('a4050000-0000-4000-8000-000000000004', 'a4050000-0000-4000-8000-000000000001', 'email', 'info@sakura-spremberg.de', 'Vorsitzender Daniel Zuchold', true),
  ('a4050000-0000-4000-8000-000000000005', 'a4050000-0000-4000-8000-000000000001', 'phone', '+49 3563 94100', 'Telefon', false),
  ('a4050000-0000-4000-8000-000000000006', 'a4050000-0000-4000-8000-000000000001', 'fax', '+49 3563 600420', 'Fax', false),
  ('a4060000-0000-4000-8000-000000000004', 'a4060000-0000-4000-8000-000000000001', 'email', 'PSV.Cottbus-judo@web.de', 'Vorsitzende Elke Nowack', true),
  ('a4060000-0000-4000-8000-000000000005', 'a4060000-0000-4000-8000-000000000001', 'phone', '+49 355 2891744', 'Telefon', false),
  ('a4060000-0000-4000-8000-000000000006', 'a4060000-0000-4000-8000-000000000001', 'fax', '+49 355 4779587', 'Fax', false),
  ('a4070000-0000-4000-8000-000000000004', 'a4070000-0000-4000-8000-000000000001', 'email', 'stanjo3@web.de', 'Vorsitzende Andrea Pfeiffer', true),
  ('a4070000-0000-4000-8000-000000000005', 'a4070000-0000-4000-8000-000000000001', 'phone', '+49 3573 791693', 'Telefon', false),
  ('a4080000-0000-4000-8000-000000000004', 'a4080000-0000-4000-8000-000000000001', 'email', 'judoteam-dahme@web.de', 'Abteilungsleiter Edgar Germersdorf', true),
  ('a4080000-0000-4000-8000-000000000005', 'a4080000-0000-4000-8000-000000000001', 'phone', '+49 35451 341', 'Telefon', false),
  ('a4080000-0000-4000-8000-000000000006', 'a4080000-0000-4000-8000-000000000001', 'phone', '+49 151 42319720', 'Mobil', false),
  ('a4090000-0000-4000-8000-000000000004', 'a4090000-0000-4000-8000-000000000001', 'email', 'psv-judo@judo-ffo.de', 'Abteilungsleiter Ludwig Baumann', true),
  ('a4090000-0000-4000-8000-000000000005', 'a4090000-0000-4000-8000-000000000001', 'phone', '+49 172 3150291', 'Telefon', false),
  ('a4090000-0000-4000-8000-000000000006', 'a4090000-0000-4000-8000-000000000001', 'fax', '+49 335 2849407', 'Fax', false),
  ('a4100000-0000-4000-8000-000000000004', 'a4100000-0000-4000-8000-000000000001', 'email', 'volker_kurze@web.de', 'Vorsitzender Volker Kurze', true),
  ('a4100000-0000-4000-8000-000000000005', 'a4100000-0000-4000-8000-000000000001', 'phone', '+49 173 7454999', 'Telefon', false),
  ('a4100000-0000-4000-8000-000000000006', 'a4100000-0000-4000-8000-000000000001', 'fax', '+49 35752 77512', 'Fax', false),
  ('a4110000-0000-4000-8000-000000000004', 'a4110000-0000-4000-8000-000000000001', 'email', 'budo-dojo@web.de', 'Vorsitzender Axel Stuwe', true),
  ('a4110000-0000-4000-8000-000000000005', 'a4110000-0000-4000-8000-000000000001', 'phone', '+49 3361 340142', 'Telefon', false),
  ('a4110000-0000-4000-8000-000000000006', 'a4110000-0000-4000-8000-000000000001', 'fax', '+49 3361 340142', 'Fax', false),
  ('a4120000-0000-4000-8000-000000000004', 'a4120000-0000-4000-8000-000000000001', 'email', 'info@budoverein-lauchhammer.de', 'Vorsitzender Jens Schwarzer', true),
  ('a4120000-0000-4000-8000-000000000005', 'a4120000-0000-4000-8000-000000000001', 'phone', '+49 3574 761827', 'Telefon', false),
  ('a4120000-0000-4000-8000-000000000006', 'a4120000-0000-4000-8000-000000000001', 'fax', '+49 3574 465390', 'Fax', false),
  ('a4140000-0000-4000-8000-000000000004', 'a4140000-0000-4000-8000-000000000001', 'email', 'hsv-judo@gmx.de', 'Abteilungsleiter Marcel Schaarschmidt', true),
  ('a4140000-0000-4000-8000-000000000005', 'a4140000-0000-4000-8000-000000000001', 'phone', '+49 152 54793338', 'Telefon', false),
  ('a4150000-0000-4000-8000-000000000004', 'a4150000-0000-4000-8000-000000000001', 'email', 'ckoppatz@web.de', 'Vorsitzende Caroline Koppatz', true),
  ('a4150000-0000-4000-8000-000000000005', 'a4150000-0000-4000-8000-000000000001', 'phone', '+49 157 32040643', 'Telefon', false),
  ('a4160000-0000-4000-8000-000000000004', 'a4160000-0000-4000-8000-000000000001', 'email', 'CoachDaniel@web.de', 'Vorsitzender Daniel Klenner', true),
  ('a4160000-0000-4000-8000-000000000005', 'a4160000-0000-4000-8000-000000000001', 'email', 'jwojwd@t-online.de', 'Geschäftsadresse Martin Reißmann', true),
  ('a4170000-0000-4000-8000-000000000004', 'a4170000-0000-4000-8000-000000000001', 'email', 'rudnik.joerg-janet@gmx.de', 'Vorsitzender Jörg Rudnick', true),
  ('a4170000-0000-4000-8000-000000000005', 'a4170000-0000-4000-8000-000000000001', 'phone', '+49 3546 182835', 'Telefon', false),
  ('a4170000-0000-4000-8000-000000000006', 'a4170000-0000-4000-8000-000000000001', 'fax', '+49 3546 187678', 'Fax', false),
  ('a4180000-0000-4000-8000-000000000004', 'a4180000-0000-4000-8000-000000000001', 'email', 'dir.meyer@web.de', 'Vorsitzender Dirk Meyer', true),
  ('a4180000-0000-4000-8000-000000000005', 'a4180000-0000-4000-8000-000000000001', 'email', 'info@ksc-asahi.de', 'Verein', true),
  ('a4180000-0000-4000-8000-000000000006', 'a4180000-0000-4000-8000-000000000001', 'phone', '+49 3563 600105', 'Telefon', false),
  ('a4180000-0000-4000-8000-000000000007', 'a4180000-0000-4000-8000-000000000001', 'phone', '+49 170 3114014', 'Mobil', false),
  ('a4200000-0000-4000-8000-000000000004', 'a4200000-0000-4000-8000-000000000001', 'email', 'kontakt@jvnz63.de', 'Vorsitzender Dr. Olaf Meyer', true),
  ('a4200000-0000-4000-8000-000000000005', 'a4200000-0000-4000-8000-000000000001', 'phone', '+49 3362 7000005', 'Telefon', false),
  ('a4230000-0000-4000-8000-000000000004', 'a4230000-0000-4000-8000-000000000001', 'email', 'Boehm.vetschau@t-online.de', 'Vorsitzender Erwin Böhm', true),
  ('a4230000-0000-4000-8000-000000000005', 'a4230000-0000-4000-8000-000000000001', 'phone', '+49 35433 70285', 'Telefon', false),
  ('a4230000-0000-4000-8000-000000000006', 'a4230000-0000-4000-8000-000000000001', 'phone', '+49 162 1708024', 'Mobil', false),
  ('a4260000-0000-4000-8000-000000000004', 'a4260000-0000-4000-8000-000000000001', 'email', 'Matthias.Stoerzner@gmx.de', 'Abteilungsleiter Matthias Störzner', true),
  ('a4260000-0000-4000-8000-000000000005', 'a4260000-0000-4000-8000-000000000001', 'phone', '+49 3544 555265', 'Telefon', false),
  ('a4260000-0000-4000-8000-000000000006', 'a4260000-0000-4000-8000-000000000001', 'phone', '+49 172 7961700', 'Mobil', false),
  ('a4270000-0000-4000-8000-000000000004', 'a4270000-0000-4000-8000-000000000001', 'email', 's.medack@sakura-fitness.de', 'Vereinsvorsitzender Maik Conrad / Post Stefan Medack', true),
  ('a4270000-0000-4000-8000-000000000005', 'a4270000-0000-4000-8000-000000000001', 'phone', '+49 3573 148282', 'Telefon', false),
  ('a4270000-0000-4000-8000-000000000006', 'a4270000-0000-4000-8000-000000000001', 'fax', '+49 3573 148283', 'Fax', false);
