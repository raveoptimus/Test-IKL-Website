import { Player, Role, Team, DreamTeamSubmission } from './types';

// Update this version string whenever you paste new data from Admin to force users to reload fresh data
// CHANGE THIS (e.g., V4, V5, V6) every time you update the players list below!
export const DATA_VERSION = '2025-FALL-V4'; 

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CLASH]: 'CLASH LANE',
  [Role.FARM]: 'FARM LANE',
  [Role.JUNGLE]: 'JUNGLER',
  [Role.MID]: 'MID LANE',
  [Role.ROAM]: 'ROAMER'
};


// --- PASTE THIS INTO constants.ts TO SYNC DATA ---

// Simulate KV Data for Players
export const MOCK_PLAYERS: Player[] = [
  {
    "id": "1",
    "name": "RRQ.Harpist",
    "team": "REX REGUM QEON",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1wBPg4cSl_QffKYsiDYv_PH-xFdtm4X_4&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 81,
      "death": 54,
      "assist": 125,
      "gpm": 810.8
    }
  },
  {
    "id": "2",
    "name": "RRQ.Bai",
    "team": "REX REGUM QEON",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1aKq_HfSlhXfZx5KNo8v1NxPVqzkWLDuH&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 91,
      "death": 54,
      "assist": 145,
      "gpm": 745.6
    }
  },
  {
    "id": "3",
    "name": "RRQ.Lexx.",
    "team": "REX REGUM QEON",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1ISTYoZGb7i5sZDPksJvgbqShozxCskEW&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 51,
      "death": 47,
      "assist": 176,
      "gpm": 644.6
    }
  },
  {
    "id": "4",
    "name": "RRQ.Xinglin",
    "team": "REX REGUM QEON",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1ZMl91CYVRNNlvKGyC-ksTFb0SGHSCZ6Z&sz=w1000",
    "stats": {
      "matches": 34,
      "kill": 70,
      "death": 65,
      "assist": 139,
      "gpm": 746.3
    }
  },
  {
    "id": "5",
    "name": "RRQ.663",
    "team": "REX REGUM QEON",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1ndJTOI8N2V6Fhwf1EGEy6f-MbNwViKko&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 14,
      "death": 55,
      "assist": 237,
      "gpm": 532.5
    }
  },
  {
    "id": "6",
    "name": "RRQ.Frederica",
    "team": "REX REGUM QEON",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1vzQBlpv1Wy9x1fQcBClooAu9hXeE4vCQ&sz=w1000",
    "stats": {
      "matches": 1,
      "kill": 2,
      "death": 4,
      "assist": 3,
      "gpm": 20.3
    }
  },
  {
    "id": "7",
    "name": "BTR.Zaan",
    "team": "BIGETRON BY VITALITY",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1xsDc7Wkomc7gYZwQApJI8_gTGM3DdfDv&sz=w1000",
    "stats": {
      "matches": 50,
      "kill": 136,
      "death": 46,
      "assist": 180,
      "gpm": 1197.8
    }
  },
  {
    "id": "8",
    "name": "BTR.ZhanQ",
    "team": "BIGETRON BY VITALITY",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1a2daY_-E2q2GPj9Wo2VSwuU7o3PNU0UJ&sz=w1000",
    "stats": {
      "matches": 50,
      "kill": 158,
      "death": 47,
      "assist": 197,
      "gpm": 1168.5
    }
  },
  {
    "id": "9",
    "name": "BTR.Niel",
    "team": "BIGETRON BY VITALITY",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1cNDVE98GCTNHJWF6dZ9_97MpZIiGjvnk&sz=w1000",
    "stats": {
      "matches": 50,
      "kill": 63,
      "death": 59,
      "assist": 265,
      "gpm": 840.3
    }
  },
  {
    "id": "10",
    "name": "BTR.Tufzzz",
    "team": "BIGETRON BY VITALITY",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1jcE-macs4RlYZHO-kT_Ap6NrrFafUPyT&sz=w1000",
    "stats": {
      "matches": 50,
      "kill": 77,
      "death": 78,
      "assist": 181,
      "gpm": 1057.8
    }
  },
  {
    "id": "11",
    "name": "BTR.Nineteen",
    "team": "BIGETRON BY VITALITY",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=12nepViHDaK8j4-Rwp2ECS3b_1t0rC3f8&sz=w1000",
    "stats": {
      "matches": 4,
      "kill": 2,
      "death": 5,
      "assist": 17,
      "gpm": 56.8
    }
  },
  {
    "id": "12",
    "name": "BTR.Saule",
    "team": "BIGETRON BY VITALITY",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1RJ-a5bHBe43ytUOf8GhmO9VbY9sCeNHS&sz=w1000",
    "stats": {
      "matches": 0,
      "kill": 0,
      "death": 0,
      "assist": 0,
      "gpm": 0
    }
  },
  {
    "id": "13",
    "name": "BTR.Ormson",
    "team": "BIGETRON BY VITALITY",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1xXjIudyrLgCDXbQAxyZ-Z2BYl1MBISDp&sz=w1000",
    "stats": {
      "matches": 46,
      "kill": 25,
      "death": 46,
      "assist": 338,
      "gpm": 679.3
    }
  },
  {
    "id": "14",
    "name": "ONIC.Fadelboy",
    "team": "ONIC",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1E6Q12ygoJKI2XwgSPsaw7pWDaJa3Syee&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 38,
      "death": 46,
      "assist": 108,
      "gpm": 549.5
    }
  },
  {
    "id": "15",
    "name": "ONIC.Falah",
    "team": "ONIC",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1J511vo02cVz2r8YkhAULcawTT2EVY17Z&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 17,
      "death": 77,
      "assist": 153,
      "gpm": 452.3
    }
  },
  {
    "id": "16",
    "name": "ONIC.Ahem",
    "team": "ONIC",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1REw4dtIeu-8817lnNAzLO3dFskgNzhz8&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 40,
      "death": 54,
      "assist": 97,
      "gpm": 666.1
    }
  },
  {
    "id": "17",
    "name": "ONIC.Switch",
    "team": "ONIC",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1ODPptgFFSXNTCbxww7mZhPM-9v3oNDL3&sz=w1000",
    "stats": {
      "matches": 29,
      "kill": 40,
      "death": 83,
      "assist": 86,
      "gpm": 605.8
    }
  },
  {
    "id": "18",
    "name": "ONIC.AZ1",
    "team": "ONIC",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1ys9TX-ybfbBvD9lq65Ojh24ey6Yild1n&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 69,
      "death": 54,
      "assist": 82,
      "gpm": 708.7
    }
  },
  {
    "id": "19",
    "name": "ONIC.Kine",
    "team": "ONIC",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1MehH39XrbBXGbp9FQkrtyB9P1GUWCAIh&sz=w1000",
    "stats": {
      "matches": 1,
      "kill": 0,
      "death": 2,
      "assist": 1,
      "gpm": 17.8
    }
  },
  {
    "id": "20",
    "name": "AE.DECOY",
    "team": "ALTER EGO ESPORTS",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1LYetG51-x4nDddPG51GDhF9-S4GOeGlt&sz=w1000",
    "stats": {
      "matches": 29,
      "kill": 8,
      "death": 64,
      "assist": 120,
      "gpm": 436.9
    }
  },
  {
    "id": "21",
    "name": "AE.CLAUSEN",
    "team": "ALTER EGO ESPORTS",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1fE4UB2UH8jUGLyejY_zPZUi8iyFqRk9y&sz=w1000",
    "stats": {
      "matches": 16,
      "kill": 14,
      "death": 27,
      "assist": 41,
      "gpm": 327
    }
  },
  {
    "id": "22",
    "name": "AE.1Tut",
    "team": "ALTER EGO ESPORTS",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=16Z-heM7XoWo9VZAm9INoL3c5J2d7K16z&sz=w1000",
    "stats": {
      "matches": 29,
      "kill": 51,
      "death": 45,
      "assist": 66,
      "gpm": 697.1
    }
  },
  {
    "id": "23",
    "name": "AE.ZenShao",
    "team": "ALTER EGO ESPORTS",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1hh-p6BKTjtxezAL7qt4KqinpCKBy1W-b&sz=w1000",
    "stats": {
      "matches": 29,
      "kill": 60,
      "death": 52,
      "assist": 68,
      "gpm": 677.9
    }
  },
  {
    "id": "24",
    "name": "AE.niubii",
    "team": "ALTER EGO ESPORTS",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1-i7VNkKkCLnCCRf3UcJLb9VAgUP6cxtA&sz=w1000",
    "stats": {
      "matches": 29,
      "kill": 29,
      "death": 52,
      "assist": 96,
      "gpm": 509.5
    }
  },
  {
    "id": "25",
    "name": "AE.Icytail",
    "team": "ALTER EGO ESPORTS",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1EMpKazgTnOTAQ_kVJNme6aA5dtiwYiG5&sz=w1000",
    "stats": {
      "matches": 13,
      "kill": 9,
      "death": 29,
      "assist": 45,
      "gpm": 251.6
    }
  },
  {
    "id": "26",
    "name": "KAGE.Senkooo",
    "team": "KAGENDRA",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1TC6MVbieUuKN-rl5VV2E9sHk1bOdpRAq&sz=w1000",
    "stats": {
      "matches": 46,
      "kill": 91,
      "death": 42,
      "assist": 256,
      "gpm": 889.6
    }
  },
  {
    "id": "27",
    "name": "KAGE.iHanss",
    "team": "KAGENDRA",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1JtDyPZ3475heDVjjxYNBqcG4rTgEBoH8&sz=w1000",
    "stats": {
      "matches": 45,
      "kill": 84,
      "death": 100,
      "assist": 188,
      "gpm": 925.6
    }
  },
  {
    "id": "28",
    "name": "KAGE.Wiraww",
    "team": "KAGENDRA",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1C6zUCZUG-lmw4URGYypJCFv-GB8ghfWZ&sz=w1000",
    "stats": {
      "matches": 46,
      "kill": 117,
      "death": 73,
      "assist": 194,
      "gpm": 949.9
    }
  },
  {
    "id": "29",
    "name": "KAGE.LanFeng",
    "team": "KAGENDRA",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1pOD4mdlsNy-JeOorA0PmBpwketf3k-VO&sz=w1000",
    "stats": {
      "matches": 46,
      "kill": 172,
      "death": 62,
      "assist": 206,
      "gpm": 1123.9
    }
  },
  {
    "id": "30",
    "name": "KAGE.Lu",
    "team": "KAGENDRA",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=177u4eYR7GkCLl0z0NGeu-myAl7dyJrw7&sz=w1000",
    "stats": {
      "matches": 46,
      "kill": 30,
      "death": 68,
      "assist": 375,
      "gpm": 689.2
    }
  },
  {
    "id": "31",
    "name": "KAGE.ZeroZero",
    "team": "KAGENDRA",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1OnrNgQIdqEF6T04CPbpi7XibdolP6QpP&sz=w1000",
    "stats": {
      "matches": 1,
      "kill": 1,
      "death": 0,
      "assist": 4,
      "gpm": 21.4
    }
  },
  {
    "id": "32",
    "name": "DMT.EL",
    "team": "DOMINATOR ESPORTS",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1hJYU3xZG68SYO0DKq-8J9GJjFIIFZIjn&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 18,
      "death": 55,
      "assist": 256,
      "gpm": 510.3
    }
  },
  {
    "id": "33",
    "name": "DMT.JerL",
    "team": "DOMINATOR ESPORTS",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1wGaUCisP-m5uxCo8xcWQl_aKz2y8-C5Z&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 66,
      "death": 55,
      "assist": 163,
      "gpm": 664.1
    }
  },
  {
    "id": "34",
    "name": "DMT.CipengZ",
    "team": "DOMINATOR ESPORTS",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1TSyl59Ud8LQ5wCgxiXmjKBqOZwPRxgu_&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 57,
      "death": 69,
      "assist": 129,
      "gpm": 688.5
    }
  },
  {
    "id": "35",
    "name": "DMT.TianX",
    "team": "DOMINATOR ESPORTS",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=15fVioXCEt0vvrAhyyeFESYR_Or7wej57&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 109,
      "death": 70,
      "assist": 126,
      "gpm": 840.7
    }
  },
  {
    "id": "36",
    "name": "DMT.Toshi",
    "team": "DOMINATOR ESPORTS",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=13hQfZdJIcSVee6JYHKxfnxtEp9lWUQnn&sz=w1000",
    "stats": {
      "matches": 35,
      "kill": 77,
      "death": 49,
      "assist": 143,
      "gpm": 796
    }
  },
  {
    "id": "37",
    "name": "DMT.anaktuyulz",
    "team": "DOMINATOR ESPORTS",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1M5-hYHth980OlV5nk9Y3qrus57HGsfYH&sz=w1000",
    "stats": {
      "matches": 0,
      "kill": 0,
      "death": 0,
      "assist": 0,
      "gpm": 0
    }
  },
  {
    "id": "38",
    "name": "TLN.SRD",
    "team": "TALON",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=18PHIbdX1PUj2zHX_9BJo5zjIKB4iFuwy&sz=w1000",
    "stats": {
      "matches": 31,
      "kill": 68,
      "death": 60,
      "assist": 132,
      "gpm": 675.9
    }
  },
  {
    "id": "39",
    "name": "TLN.Choux",
    "team": "TALON",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1HC5UJcuU4NscxTZXevdNWrdS9PIbmamD&sz=w1000",
    "stats": {
      "matches": 31,
      "kill": 57,
      "death": 75,
      "assist": 121,
      "gpm": 650.9
    }
  },
  {
    "id": "40",
    "name": "TLN.Xena",
    "team": "TALON",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1NMCyvHW_hBjd9s6Ru_DWgdLRwteCzl1X&sz=w1000",
    "stats": {
      "matches": 31,
      "kill": 12,
      "death": 57,
      "assist": 196,
      "gpm": 462.9
    }
  },
  {
    "id": "41",
    "name": "TLN.Lcc2",
    "team": "TALON",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=16v1LojrcyOMx8py-2yJDhQzlGV9TAgrQ&sz=w1000",
    "stats": {
      "matches": 31,
      "kill": 49,
      "death": 67,
      "assist": 152,
      "gpm": 581.4
    }
  },
  {
    "id": "42",
    "name": "TLN.Luochenn",
    "team": "TALON",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1ImXS-qeKbf3_S4VD3k--Sc_r_fjBDxjR&sz=w1000",
    "stats": {
      "matches": 31,
      "kill": 85,
      "death": 36,
      "assist": 104,
      "gpm": 728.1
    }
  },
  {
    "id": "43",
    "name": "TLN.Tokyo",
    "team": "TALON",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1BYN9xyDBPCMOLu3vSK6ZfoW_9av-m-sy&sz=w1000",
    "stats": {
      "matches": 0,
      "kill": 0,
      "death": 0,
      "assist": 0,
      "gpm": 0
    }
  },
  {
    "id": "44",
    "name": "MHD.Zhe",
    "team": "MAHADEWA",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=18YGtNYayo7v75XGYJb0XZz1t4evun2nz&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 73,
      "death": 62,
      "assist": 93,
      "gpm": 663
    }
  },
  {
    "id": "45",
    "name": "MHD.Enyxx",
    "team": "MAHADEWA",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1A3TyiHPtOok9ZlCd4ql6k7HOdljQWnET&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 85,
      "death": 37,
      "assist": 117,
      "gpm": 723.1
    }
  },
  {
    "id": "46",
    "name": "MHD.Axiorety",
    "team": "MAHADEWA",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1bWQ1Oj6ZnO1dw7pDzp98-vC1idcMbjbV&sz=w1000",
    "stats": {
      "matches": 30,
      "kill": 43,
      "death": 46,
      "assist": 140,
      "gpm": 547.5
    }
  },
  {
    "id": "47",
    "name": "MHD.Newack",
    "team": "MAHADEWA",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1deeqFUVF-i-DXuLxp7nR0aKNzO7iEI4F&sz=w1000",
    "stats": {
      "matches": 19,
      "kill": 14,
      "death": 37,
      "assist": 155,
      "gpm": 297.4
    }
  },
  {
    "id": "48",
    "name": "MHD.K1",
    "team": "MAHADEWA",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1RqRLmUSJPVJ1aZCn0EZKjDrnJpjBiMhx&sz=w1000",
    "stats": {
      "matches": 22,
      "kill": 29,
      "death": 51,
      "assist": 77,
      "gpm": 445.6
    }
  },
  {
    "id": "49",
    "name": "MHD.Monss",
    "team": "MAHADEWA",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1SCVGOhZostsVWHZ_RuF9TwrIzduPDyV1&sz=w1000",
    "stats": {
      "matches": 19,
      "kill": 17,
      "death": 43,
      "assist": 88,
      "gpm": 323.4
    }
  },
  {
    "id": "50",
    "name": "VESA.Nev",
    "team": "VESAKHA ESPORTS",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1911dCXlCmaAoRmc68uZLTocfxwKeR-8N&sz=w1000",
    "stats": {
      "matches": 41,
      "kill": 113,
      "death": 81,
      "assist": 183,
      "gpm": 921.2
    }
  },
  {
    "id": "51",
    "name": "VESA.JenMyth",
    "team": "VESAKHA ESPORTS",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1f-VSHyjhoi9Ba0QlIdeR7sFHvWbcEcmZ&sz=w1000",
    "stats": {
      "matches": 41,
      "kill": 78,
      "death": 54,
      "assist": 234,
      "gpm": 739.1
    }
  },
  {
    "id": "52",
    "name": "VESA.Bal",
    "team": "VESAKHA ESPORTS",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=15Z3GR4XdK1V_v6APmtzKgI0NuJqDG5oq&sz=w1000",
    "stats": {
      "matches": 41,
      "kill": 98,
      "death": 97,
      "assist": 159,
      "gpm": 850.1
    }
  },
  {
    "id": "53",
    "name": "VESA.JunYong",
    "team": "VESAKHA ESPORTS",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1EmSO661UBVYRDHc0WYVKt4q8OlIY9xQp&sz=w1000",
    "stats": {
      "matches": 41,
      "kill": 21,
      "death": 67,
      "assist": 306,
      "gpm": 618.4
    }
  },
  {
    "id": "54",
    "name": "VESA.Raven",
    "team": "VESAKHA ESPORTS",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1M5WZA1YC0C7f_hw2nexnzl6XOsjlGvAl&sz=w1000",
    "stats": {
      "matches": 41,
      "kill": 109,
      "death": 81,
      "assist": 166,
      "gpm": 970.5
    }
  },
  {
    "id": "55",
    "name": "VESA.Barudak",
    "team": "VESAKHA ESPORTS",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1BKNhEbbOWYcg7oWS82r8N6AePUcmEmJL&sz=w1000",
    "stats": {
      "matches": 0,
      "kill": 0,
      "death": 0,
      "assist": 0,
      "gpm": 0
    }
  },
  {
    "id": "56",
    "name": "VESA.Sieg",
    "team": "VESAKHA ESPORTS",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1a8iPhbgVNPLLa9lMD1WgU_GyyZ_FVktT&sz=w1000",
    "stats": {
      "matches": 0,
      "kill": 0,
      "death": 0,
      "assist": 0,
      "gpm": 0
    }
  },
  {
    "id": "57",
    "name": "RVM.Acaaaa",
    "team": "REVEMOIN ESPORTS",
    "role": Role.MID,
    "image": "https://drive.google.com/thumbnail?id=1MMERFZ8UQsAX7oKMhSUIS-UO_EdzWc80&sz=w1000",
    "stats": {
      "matches": 27,
      "kill": 17,
      "death": 68,
      "assist": 74,
      "gpm": 454.5
    }
  },
  {
    "id": "58",
    "name": "RVM.Imagination",
    "team": "REVEMOIN ESPORTS",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=1CRiIt_Aam5HBeBUXXD4ux1UfWZFlVOji&sz=w1000",
    "stats": {
      "matches": 27,
      "kill": 42,
      "death": 40,
      "assist": 49,
      "gpm": 626.5
    }
  },
  {
    "id": "59",
    "name": "RVM.BiLjane",
    "team": "REVEMOIN ESPORTS",
    "role": Role.ROAM,
    "image": "https://drive.google.com/thumbnail?id=1REEGqSFLrmRH5lK7g_p3HCbMPP3dsN0W&sz=w1000",
    "stats": {
      "matches": 19,
      "kill": 7,
      "death": 47,
      "assist": 76,
      "gpm": 281.1
    }
  },
  {
    "id": "60",
    "name": "RVM.L",
    "team": "REVEMOIN ESPORTS",
    "role": Role.CLASH,
    "image": "https://drive.google.com/thumbnail?id=1kreIHLDDX1aTn30ttp5mySz3cUV3u_70&sz=w1000",
    "stats": {
      "matches": 27,
      "kill": 38,
      "death": 71,
      "assist": 56,
      "gpm": 555.8
    }
  },
  {
    "id": "61",
    "name": "RVM.Sasakii",
    "team": "REVEMOIN ESPORTS",
    "role": Role.JUNGLE,
    "image": "https://drive.google.com/thumbnail?id=1oDTYQPUkLjgAXOqMczVXWr1Br2vQhRqu&sz=w1000",
    "stats": {
      "matches": 27,
      "kill": 42,
      "death": 86,
      "assist": 66,
      "gpm": 610.1
    }
  },
  {
    "id": "62",
    "name": "RVM.KidoyZ",
    "team": "REVEMOIN ESPORTS",
    "role": Role.FARM,
    "image": "https://drive.google.com/thumbnail?id=14GdCIPDmrjQOy1TlCAzx2V--XrTH6GWI&sz=w1000",
    "stats": {
      "matches": 8,
      "kill": 10,
      "death": 19,
      "assist": 15,
      "gpm": 157
    }
  }
];

// Simulate KV Data for Teams
export const MOCK_TEAMS: Team[] = [
  {
    "id": "t1",
    "name": "REX REGUM QEON",
    "matchPoints": 15,
    "matchWins": 10,
    "matchLosses": 2,
    "gameWins": 21,
    "gameLosses": 5,
    "logo": "https://drive.google.com/thumbnail?id=1HvB5iFUdcejXACV9w0zwe89q0AVnrfsu&sz=w1000"
  },
  {
    "id": "t2",
    "name": "BIGETRON BY VITALITY",
    "matchPoints": 13,
    "matchWins": 9,
    "matchLosses": 3,
    "gameWins": 19,
    "gameLosses": 8,
    "logo": "https://drive.google.com/thumbnail?id=1MuJ6SJBfMcH3JaxoQe4te2ABW-rPwAJ1&sz=w1000"
  },
  {
    "id": "t3",
    "name": "ONIC",
    "matchPoints": 10,
    "matchWins": 6,
    "matchLosses": 6,
    "gameWins": 14,
    "gameLosses": 14,
    "logo": "https://drive.google.com/thumbnail?id=1gorNyv8s645IoJcDTDjbBwG7oQCMcMwx&sz=w1000"
  },
  {
    "id": "t4",
    "name": "ALTER EGO ESPORTS",
    "matchPoints": 8,
    "matchWins": 5,
    "matchLosses": 7,
    "gameWins": 12,
    "gameLosses": 16,
    "logo": "https://drive.google.com/thumbnail?id=1p0HeAOXOPSsQhZJFLfsCsO7dYTmWTpWg&sz=w1000"
  },
  {
    "id": "t5",
    "name": "KAGENDRA",
    "matchPoints": 6,
    "matchWins": 4,
    "matchLosses": 8,
    "gameWins": 10,
    "gameLosses": 18,
    "logo": "https://drive.google.com/thumbnail?id=1jrxJdX7wY3D2HZvTXOGKXxoNmt4RywGZ&sz=w1000"
  },
  {
    "id": "t6",
    "name": "DOMINATOR ESPORTS",
    "matchPoints": 5,
    "matchWins": 2,
    "matchLosses": 10,
    "gameWins": 6,
    "gameLosses": 21,
    "logo": "https://drive.google.com/thumbnail?id=1MJiJMiDiwR3JX8-O8It6cv3ukDpdXlKL&sz=w1000"
  },
  {
    "id": "t7",
    "name": "TALON",
    "matchPoints": 4,
    "matchWins": 5,
    "matchLosses": 7,
    "gameWins": 14,
    "gameLosses": 14,
    "logo": "https://drive.google.com/thumbnail?id=15gzTU3yH82bv4ss7MVjEISdTt8AyQqkb&sz=w1000"
  },
  {
    "id": "t8",
    "name": "MAHADEWA",
    "matchPoints": 3,
    "matchWins": 4,
    "matchLosses": 8,
    "gameWins": 12,
    "gameLosses": 16,
    "logo": "https://drive.google.com/thumbnail?id=1WEue59I62hu-0DHEAdtnHxWjcgdCoh8v&sz=w1000"
  },
  {
    "id": "t9",
    "name": "VESAKHA ESPORTS",
    "matchPoints": 2,
    "matchWins": 2,
    "matchLosses": 10,
    "gameWins": 10,
    "gameLosses": 18,
    "logo": "https://drive.google.com/thumbnail?id=1rG_bPLbY3xJunxBlBeRIxDaKx2b86ZIf&sz=w1000"
  },
  {
    "id": "t10",
    "name": "REVEMOIN ESPORTS",
    "matchPoints": 1,
    "matchWins": 2,
    "matchLosses": 10,
    "gameWins": 6,
    "gameLosses": 21,
    "logo": "https://drive.google.com/thumbnail?id=13FG-_AwvWjM-wQ-Pw516X1Xs1u2gI_Tt&sz=w1000"
  }
];
    

export const MOCK_SUBMISSIONS: DreamTeamSubmission[] = [];