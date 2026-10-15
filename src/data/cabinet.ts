export interface CabinetMember {
    id: number;
    name: string;
    role: string;
    image: string;
    instagram?: string;
    subDepartment?: string; // Grouping key
}

export interface CabinetDivision {
    id: string;
    name: string;
    color: "yellow" | "blue" | "green" | "pink" | "orange";
    members: CabinetMember[];
}

export const CABINET_DATA: CabinetDivision[] = [
    {
        id: "boe",
        name: "Board of Executives",
        color: "yellow",
        members: [
            { id: 1, name: "Muhammad Farrel Ardan Zamroniansyah", role: "Project Officer", image: "/images/kabinet/boe_farel.webp", instagram: "@farrel_az" },
            { id: 2, name: "Noor Hania Rahmani", role: "Vice Project Officer", image: "/images/kabinet/boe_hania.webp", instagram: "@hania_rah" },
            { id: 3, name: "Tabina Fayola Zalianty", role: "Secretary", image: "/images/kabinet/boe_fayola.webp" },
            { id: 4, name: "Athiyya Bilqis Rahma Zaidah", role: "Vice Secretary", image: "/images/kabinet/boe_athiyya.webp" },
            { id: 5, name: "Alviani Zelda", role: "Treasurer", image: "/images/kabinet/boe_alviani.webp" },
            { id: 6, name: "Qonita Naura Izzati", role: "Vice Treasurer", image: "/images/kabinet/boe_qonita.webp" },
        ]
    },
    {
        id: "event",
        name: "Event",
        color: "blue",
        members: [
            { id: 101, name: "Selvia Adzania Arifiyanti", role: "Head of Event", image: "/images/kabinet/event_selvia.webp" }, // Core
            { id: 102, name: "Muhammad Athiril Ardan", role: "Head of VISITS", image: "/images/kabinet/event_ardan.webp", subDepartment: "VISITS" },
            { id: 103, name: "Dinda Elisya", role: "Head of TOSN", image: "/images/kabinet/event_elisya.webp", subDepartment: "TOSN" },
            { id: 104, name: "Danurwenda Eka Pangestu", role: "Staff Ahli", image: "/images/kabinet/event_danurwenda.webp", subDepartment: "VISITS" },
            { id: 105, name: "Chelsea Amanda Pratiwi", role: "Staff Ahli", image: "/images/kabinet/event_amanda.webp", subDepartment: "TOSN" },
            { id: 106, name: "Rosyida Ardiana", role: "WSN", image: "/images/kabinet/event_rosyida.webp", subDepartment: "VISITS" },
            { id: 107, name: "Chlearezza Claudia Dayyanti", role: "Staff", image: "/images/kabinet/event_chlea.webp", subDepartment: "VISITS" },
            { id: 108, name: "Rassya Naufal Daniswara", role: "Staff", image: "/images/kabinet/event_rassya.webp", subDepartment: "VISITS" },
            { id: 109, name: "Kafi Rizal Wahyudi", role: "Staff", image: "/images/kabinet/event_kafi.webp", subDepartment: "VISITS" },
            { id: 110, name: "Noor Fatkha En Nuriyah", role: "Staff", image: "/images/kabinet/event_fatkha.webp", subDepartment: "VISITS" },
            { id: 111, name: "Falinia Rahmadini", role: "Staff", image: "/images/kabinet/event_falinia.webp", subDepartment: "TOSN" },
            { id: 112, name: "Ahmad Andra Rizky Maulana", role: "Staff", image: "/images/kabinet/event_andra.webp", subDepartment: "TOSN" },
            { id: 113, name: "Muhammad Akbar Albaihaqi Dewanto", role: "Staff", image: "/images/kabinet/event_barqi.webp", subDepartment: "TOSN" },
            { id: 114, name: "Qurrota Aini Dwiyanti", role: "Staff", image: "/images/kabinet/event_qurrota.webp", subDepartment: "TOSN" },
            { id: 115, name: "Nikita Vidya Hairunisa", role: "Staff", image: "/images/kabinet/event_nikita.webp", subDepartment: "TOSN" },
            { id: 116, name: "Atha Putri Dharmawan", role: "Staff", image: "/images/kabinet/event_atha.webp", subDepartment: "TOSN" },
            { id: 117, name: "Raflimahdi Ali Ramdhan", role: "Staff", image: "/images/kabinet/event_rafli.webp", subDepartment: "TOSN" },
        ]
    },
    {
        id: "operasional",
        name: "Operational",
        color: "green",
        members: [
            { id: 201, name: "Amhar Fawaiqul Fahmi", role: "Head of Operational", image: "/images/kabinet/opr_fahmi.webp" }, // Core
            { id: 202, name: "Arasy Star Firnas", role: "Head of Equipment", image: "/images/kabinet/opr_arasy.webp", subDepartment: "Equipment" },
            { id: 203, name: "Syafrizal Cesta Adabi", role: "Head of Security & License", image: "/images/kabinet/opr_cesta.webp", subDepartment: "Security & License" },
            { id: 204, name: "Beryl Rafindra Abhista Ramadhan", role: "Head of Consumption & Medic", image: "/images/kabinet/opr_beryl.webp", subDepartment: "Consumption & Medic" },
            { id: 205, name: "Andrew Ahmad Arsyad", role: "Staff Ahli", image: "/images/kabinet/opr_andrew.webp", subDepartment: "Equipment" },
            { id: 206, name: "Ferrariel Ahnaf Xavier Chanan", role: "Staff Ahli", image: "/images/kabinet/opr_ferrariel.webp", subDepartment: "Equipment" },
            { id: 207, name: "Ahmad Fadhlur Rahman", role: "Staff Ahli", image: "/images/kabinet/opr_fadhlur.webp", subDepartment: "Equipment" },
            { id: 208, name: "Risfaldo Rizki Putra", role: "Staff Ahli", image: "/images/kabinet/opr_risfaldo.webp", subDepartment: "Security & License" },
            { id: 209, name: "Kinanti Ayu Caesandria", role: "Staff Ahli", image: "/images/kabinet/opr_kinanti.webp", subDepartment: "Security & License" },
            { id: 210, name: "Rizky Achmad Fahreizi", role: "Staff Ahli", image: "/images/kabinet/opr_risky.webp", subDepartment: "Security & License" },
            { id: 211, name: "Ayunda Khujjatun Khoirun Nisa", role: "Staff Ahli", image: "/images/kabinet/opr_ayunda.webp", subDepartment: "Consumption & Medic" },
            { id: 212, name: "Najwa Neza Zabilla", role: "Staff Ahli", image: "/images/kabinet/opr_najwa.webp", subDepartment: "Consumption & Medic" },
            { id: 213, name: "Achmad Rifqy Aqila", role: "Staff", image: "/images/kabinet/opr_achmaf.webp", subDepartment: "Equipment" },
            { id: 214, name: "Rafi Danendra Pratama", role: "Staff", image: "/images/kabinet/opr_rafi.webp", subDepartment: "Equipment" },
            { id: 215, name: "Gordon Abigail Surya", role: "Staff", image: "/images/kabinet/opr_gordon.webp", subDepartment: "Equipment" },
            { id: 216, name: "Ahsan Maulana", role: "Staff", image: "/images/kabinet/opr_ahsan.webp", subDepartment: "Equipment" },
            { id: 217, name: "Brian Binara lindung", role: "Staff", image: "/images/kabinet/opr_brian.webp", subDepartment: "Equipment" },
            { id: 218, name: "Muhammad AL Hikam", role: "Staff", image: "/images/kabinet/opr_hikam.webp", subDepartment: "Equipment" },
            { id: 219, name: "Muhammad Haidar Hariri", role: "Staff", image: "/images/kabinet/opr_haidar.webp", subDepartment: "Equipment" },
            { id: 220, name: "Muhammad Raihan Munif Dzakyansyah", role: "Staff", image: "/images/kabinet/opr_rayhan.webp", subDepartment: "Equipment" },
            { id: 221, name: "Angelita Rachma Putri", role: "Staff", image: "/images/kabinet/opr_angel.webp", subDepartment: "Security & License" },
            { id: 222, name: "Ghulam Rizqy Satria Widyadhana", role: "Staff", image: "/images/kabinet/opr_ghulam.webp", subDepartment: "Security & License" },
            { id: 223, name: "Maulana Kafka Sutanto", role: "Staff", image: "/images/kabinet/opr_kafka.webp", subDepartment: "Security & License" },
            { id: 224, name: "Ahmad Thariq Zidan", role: "Staff", image: "/images/kabinet/opr_thariq.webp", subDepartment: "Security & License" },
            { id: 225, name: "Marcello Julian Putra", role: "Staff", image: "/images/kabinet/opr_marcello.webp", subDepartment: "Security & License" },
            { id: 226, name: "Raffa Al Azmi", role: "Staff", image: "/images/kabinet/opr_raffa.webp", subDepartment: "Security & License" },
            { id: 227, name: "Muhammad Irfan Firmansyah", role: "Staff", image: "/images/kabinet/opr_irfan.webp", subDepartment: "Security & License" },
            { id: 228, name: "Mariska Aurelia Hapsari", role: "Staff", image: "/images/kabinet/opr_mariska.webp", subDepartment: "Security & License" },
            { id: 229, name: "Achmad Younge Giri Ananta", role: "Staff", image: "/images/kabinet/opr_giri.webp", subDepartment: "Security & License" },
            { id: 230, name: "Cika Aline Mauludina", role: "Staff", image: "/images/kabinet/opr_cika.webp", subDepartment: "Consumption & Medic" },
            { id: 231, name: "Azzarine Zahirah Azesha", role: "Staff", image: "/images/kabinet/opr_azzarine.webp", subDepartment: "Consumption & Medic" },
            { id: 232, name: "Aqmal Falaq Azh-Zhahiri Al-Cholili", role: "Staff", image: "/images/kabinet/opr_aqmal.webp", subDepartment: "Consumption & Medic" },
            { id: 233, name: "Ria Andisa Firdaus", role: "Staff", image: "/images/kabinet/opr_ria.webp", subDepartment: "Consumption & Medic" },
            { id: 234, name: "Muhammad Syarif", role: "Staff", image: "/images/kabinet/opr_syarif.webp", subDepartment: "Consumption & Medic" },
        ]
    },
    {
        id: "creadoc",
        name: "Creative",
        color: "pink",
        members: [
            { id: 301, name: "Hafiz Arief", role: "Head of Creative", image: "/images/kabinet/creative_hafiz.webp" }, // Core
            { id: 302, name: "Muhammad Imren Firdy Averouz", role: "Head of Design", image: "/images/kabinet/creative_imren.webp", subDepartment: "Design" },
            { id: 303, name: "Alya Zahwah Ramadhani", role: "Head of Decoration", image: "/images/kabinet/creative_alya.webp", subDepartment: "Decoration" },
            { id: 304, name: "Yuan Cahya Adhitya", role: "Head of Media Production", image: "/images/kabinet/creative_yuan.webp", subDepartment: "Media Production" },
            { id: 305, name: "Astri Anggraini", role: "Staff Ahli", image: "/images/kabinet/creative_astri.webp", subDepartment: "Design" },
            { id: 306, name: "Catherine Daniela", role: "Staff Ahli", image: "/images/kabinet/creative_catherine.webp", subDepartment: "Design" },
            { id: 307, name: "Farrel Anggadita Danendra Auryn Lisviandi", role: "Staff Ahli", image: "/images/kabinet/creative_farrel.webp", subDepartment: "Decoration" },
            { id: 308, name: "Yokebet Cloudy Berlian", role: "Staff Ahli", image: "/images/kabinet/creative_yokebet.webp", subDepartment: "Decoration" },
            { id: 309, name: "Shofy Aniro Al Labiba", role: "Staff Ahli", image: "/images/kabinet/creative_shofy.webp", subDepartment: "Media Production" },
            { id: 310, name: "Dava Febriansyah", role: "Staff", image: "/images/kabinet/creative_dava.webp", subDepartment: "Design" },
            { id: 311, name: "Hafidh Muhammad Ahnaaf", role: "Staff", image: "/images/kabinet/creative_hafidh.webp", subDepartment: "Design" },
            { id: 312, name: "Muhammad Rafi Naufal", role: "Staff", image: "/images/kabinet/creative_rafi.webp", subDepartment: "Design" },
            { id: 313, name: "Nisrina Putri Wildan", role: "Staff", image: "/images/kabinet/creative_nisrina.webp", subDepartment: "Decoration" },
            { id: 314, name: "Alva Ariffudin", role: "Staff", image: "/images/kabinet/creative_alva.webp", subDepartment: "Decoration" },
            { id: 315, name: "Mochammad Izzanuddin Firdaus", role: "Staff", image: "/images/kabinet/creative_izzan.webp", subDepartment: "Decoration" },
            { id: 316, name: "Astri Rahman Naufa", role: "Staff", image: "/images/kabinet/creative_naufa.webp", subDepartment: "Decoration" },
            { id: 317, name: "Muhammad Prasetyo Hardiansyah", role: "Staff", image: "/images/kabinet/creative_prasetyo.webp", subDepartment: "Media Production" },
            { id: 318, name: "Adela Salsabilla Cantika Putri", role: "Staff", image: "/images/kabinet/creative_adela.webp", subDepartment: "Media Production" },
            { id: 319, name: "Satria Yudha Pamungkas", role: "Staff", image: "/images/kabinet/creative_satria.webp", subDepartment: "Media Production" },
        ]
    },
    {
        id: "finance",
        name: "Finance",
        color: "orange",
        members: [
            { id: 401, name: "Nadindra Khairurassya Zamyeri", role: "Head of Finance", image: "/images/kabinet/finance_dindra.webp" }, // Core
            { id: 402, name: "Maulana Raffy Azizi", role: "Head of Fundraising", image: "/images/kabinet/finance_azizi.webp", subDepartment: "Fundraising" },
            { id: 403, name: "Lareyna Zahira Afifuddin", role: "Head of Sponsorship", image: "/images/kabinet/finance_lareyna.webp", subDepartment: "Sponsorship" },
            { id: 404, name: "Farah Nayla Ardini", role: "Staff Ahli", image: "/images/kabinet/finance_farah.webp", subDepartment: "Fundraising" },
            { id: 405, name: "Faathika Anaya kusuma putri", role: "Staff Ahli", image: "/images/kabinet/finance_anaya.webp", subDepartment: "Fundraising" },
            { id: 406, name: "Siti Rahma Revalina", role: "Staff Ahli", image: "/images/kabinet/finance_siti.webp", subDepartment: "Fundraising" },
            { id: 407, name: "Radella Alva Chairunnisa", role: "Staff Ahli", image: "/images/kabinet/finance_radella.webp", subDepartment: "Sponsorship" },
            { id: 408, name: "Salwa Azzahra Wachid", role: "Staff Ahli", image: "/images/kabinet/finance_salwa.webp", subDepartment: "Sponsorship" },
            { id: 409, name: "Eleonora Jessica Verlyn Valentine", role: "Staff", image: "/images/kabinet/finance_eleonara.webp", subDepartment: "Fundraising" },
            { id: 410, name: "Sisca Putri Nur Jannah", role: "Staff", image: "/images/kabinet/finance_sisca.webp", subDepartment: "Fundraising" },
            { id: 411, name: "Muhammad Muslikh Ramdhany", role: "Staff", image: "/images/kabinet/finance_muslikh.webp", subDepartment: "Fundraising" },
            { id: 412, name: "Naila Zalfa Hamidah", role: "Staff", image: "/images/kabinet/finance_naila.webp", subDepartment: "Fundraising" },
            { id: 413, name: "Ferizka Salsabila Azzahra Putri", role: "Staff", image: "/images/kabinet/finance_ferizka.webp", subDepartment: "Fundraising" },
            { id: 414, name: "Muhammad Rifky Athallah", role: "Staff", image: "/images/kabinet/finance_rifky.webp", subDepartment: "Fundraising" },
            { id: 415, name: "Dewi Miftahul Ghonim", role: "Staff", image: "/images/kabinet/finance_dewi.webp", subDepartment: "Sponsorship" },
            { id: 416, name: "Ahmad satrio Wicaksono", role: "Staff", image: "/images/kabinet/finance_satrio.webp", subDepartment: "Sponsorship" },
            { id: 417, name: "Gilang Hafishatama Siahaan", role: "Staff", image: "/images/kabinet/finance_gilang.webp", subDepartment: "Sponsorship" },
            { id: 418, name: "Zalfaa Khairina Nafishaa", role: "Staff", image: "/images/kabinet/finance_zalfaa.webp", subDepartment: "Sponsorship" },
            { id: 419, name: "Nella Dewi Sekartaji", role: "Staff", image: "/images/kabinet/finance_nella.webp", subDepartment: "Sponsorship" },
        ]
    },
    {
        id: "marketing_it",
        name: "Marketing & IT Dev",
        color: "blue",
        members: [
            { id: 501, name: "Bella Talitha Aulia", role: "Head of Marketing", image: "/images/kabinet/marketing_bella.webp" }, // Core
            { id: 502, name: "Angela Merici Novena Paskania", role: "Head of Sosial Media Marketing", image: "/images/kabinet/marketing_merici.webp", subDepartment: "Social Media Management" },
            { id: 503, name: "Gading Putra Priyanto", role: "Head of IT Development", image: "/images/kabinet/marketing_gading.webp", subDepartment: "IT Development" },
            { id: 504, name: "Nasyiah Tsabitah Imami", role: "Staff Ahli", image: "/images/kabinet/marketing_nasyiah.webp", subDepartment: "Social Media Management" },
            { id: 505, name: "Hirzi Taris Zhafiri", role: "Staff Ahli", image: "/images/kabinet/marketing_hirzhi.webp", subDepartment: "Social Media Management" },
            { id: 506, name: "Ahsin Khuluqil Karim", role: "Staff Ahli", image: "/images/kabinet/marketing_ahsin.webp", subDepartment: "IT Development" },
            { id: 507, name: "Nova Jihan Sabrina", role: "Staff", image: "/images/kabinet/marketing_jihan.webp", subDepartment: "Social Media Management" },
            { id: 508, name: "Anya Aurelia Putri", role: "Staff", image: "/images/kabinet/marketing_anya.webp", subDepartment: "Social Media Management" },
            { id: 509, name: "Aisyah Qonitah Shafa", role: "Staff", image: "/images/kabinet/marketing_aisyah.webp", subDepartment: "Social Media Management" },
            { id: 510, name: "Bilqis Rysvie Evelyn", role: "Staff", image: "/images/kabinet/marketing_bilqis.webp", subDepartment: "Social Media Management" },
            { id: 511, name: "Hilmi Taqiyuddin Haq", role: "Staff", image: "/images/kabinet/marketing_taqi.webp", subDepartment: "IT Development" },
            { id: 512, name: "Hasheemi Rafsanjani", role: "Staff", image: "/images/kabinet/marketing_hasheemi.webp", subDepartment: "IT Development" },
        ]
    },
    {
        id: "pr",
        name: "Public Relation",
        color: "yellow",
        members: [
            { id: 601, name: "Fadiyah Meta Salsabilah", role: "Head of Public Relations", image: "/images/kabinet/pr_fadiyah.webp" },
            { id: 602, name: "Novianty Dwi Syafitri Syamsuddin", role: "Staff Ahli", image: "/images/kabinet/pr_novianty.webp" },
            { id: 603, name: "Enzellina Zuhrotul Aulia", role: "Staff Ahli", image: "/images/kabinet/pr_enzellina.webp" },
            { id: 604, name: "Nabila Aisyah Nathania", role: "Staff", image: "/images/kabinet/pr_nabila.webp" },
            { id: 605, name: "Nurus Shafa Ardhana Nareswari", role: "Staff", image: "/images/kabinet/pr_nurus.webp" },
            { id: 606, name: "Paksi Aufa Hafiz", role: "Staff", image: "/images/kabinet/pr_paksi.webp" },
            { id: 607, name: "Firani Layyinust Tsani", role: "Staff", image: "/images/kabinet/pr_firani.webp" },
            { id: 608, name: "Kafka Nafisah", role: "Staff", image: "/images/kabinet/pr_kafka.webp" },
            { id: 609, name: "Debora Etna Sari", role: "Staff", image: "/images/kabinet/pr_debora.webp" },
            { id: 610, name: "Dewi Riska Andani", role: "Staff", image: "/images/kabinet/pr_riska.webp" },
        ]
    },
    {
        id: "dataman",
        name: "Data Management",
        color: "green",
        members: [
            { id: 701, name: "Zahra Hafizhah", role: "Head of Data Management", image: "/images/kabinet/damen_zahra.webp" },
            { id: 702, name: "Kayla Nazwa Albania Tsani", role: "Staff Ahli", image: "/images/kabinet/damen_kayla.webp" },
            { id: 703, name: "Neyna Putri Nabila", role: "Staff Ahli", image: "/images/kabinet/damen_neyna.webp" },
            { id: 704, name: "Putri Maratus Sholekhah", role: "Staff", image: "/images/kabinet/damen_putri.webp" },
            { id: 705, name: "Chilyah An Najwaa", role: "Staff", image: "/images/kabinet/damen_chilyah.webp" },
            { id: 706, name: "Irwan Maulana", role: "Staff", image: "/images/kabinet/damen_irwan.webp" },
            { id: 707, name: "Cindy Eka Meidinah", role: "Staff", image: "/images/kabinet/damen_cindy.webp" },
            { id: 708, name: "Rafa Anindya Kirana", role: "Staff", image: "/images/kabinet/damen_rafa.webp" },
            { id: 709, name: "Ilham Rizqi Langit Semesta", role: "Staff", image: "/images/kabinet/damen_ilham.webp" },
        ]
    }
];
