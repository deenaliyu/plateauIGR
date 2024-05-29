const urlParams = new URLSearchParams(window.location.search);
const userIdo = urlParams.get('id');

let usersName = [
  {
    "id": 390164,
    "name": "JOSEPH IYANYA",
    "tin": "23000043-7",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390165,
    "name": "IORLAHA AHANGBA ISAAC",
    "tin": "23205021-59",
    "accountStatus": "unlinked",
    "phoneNumber": "7034372015",
    "lga": "909",
    "address": "UKADUM MAZA ROAD, JOS NORTH"
  },
  {
    "id": 390166,
    "name": "ADANU SUNDAY SIMON",
    "tin": "23200970-58",
    "accountStatus": "linked",
    "phoneNumber": "8036197944",
    "lga": "1239",
    "address": "NURTW FANDA KARSHI"
  },
  {
    "id": 390167,
    "name": "DANIEL OKACHI",
    "tin": "23000028-57",
    "accountStatus": "linked",
    "phoneNumber": "8164145770",
    "lga": "954",
    "address": "N/A"
  },
  {
    "id": 390168,
    "name": "LUCIE-ANN M LAHA",
    "tin": "23000044-2",
    "accountStatus": "unlinked",
    "phoneNumber": "8039668212",
    "lga": "897",
    "address": "SABON BARKI, JOS SOUTH"
  },
  {
    "id": 390169,
    "name": "Mr. Emmauel O Agha",
    "tin": "23000040-8",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390171,
    "name": "RAPHEAL ASIEGBU",
    "tin": "23000040-9",
    "accountStatus": "unlinked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390172,
    "name": "daniel asabe mattah",
    "tin": "23000041-2",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390173,
    "name": "ZUMUNTAN MATA EKLISIYA COCIN LCC SARKIN MANGU",
    "tin": "23205372-48",
    "accountStatus": "linked",
    "phoneNumber": "8035701158",
    "lga": "1431",
    "address": "MANGU"
  },
  {
    "id": 390174,
    "name": "JEROBOAM JEBULOL",
    "tin": "23000040-2",
    "accountStatus": "unlinked",
    "phoneNumber": "8105883615",
    "lga": "1056",
    "address": "N/A"
  },
  {
    "id": 390175,
    "name": "RABI'ATA YUSUF",
    "tin": "23000041-8",
    "accountStatus": "linked",
    "phoneNumber": "7036832030",
    "lga": "871",
    "address": "RIKKOS, NEAR NDLEA OFFICE"
  },
  {
    "id": 390176,
    "name": "HYELDUGAL NIGERIA LIMITED",
    "tin": "23000043-0",
    "accountStatus": "unlinked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390164,
    "name": "JOSEPH IYANYA",
    "tin": "23000043-7",
    "accountStatus": "linked",
    "phoneNumber": "N/A",
    "lga": "N/A",
    "address": "N/A"
  },
  {
    "id": 390165,
    "name": "IORLAHA AHANGBA ISAAC",
    "tin": "2320502159",
    "accountStatus": "linked",
    "phoneNumber": "7034372015",
    "lga": "N/A",
    "address": "UKADUM MAZA ROAD, JOS NORTH"
  },
  {
    "id": 399870,
    "name": "WATYIL SIMON DAVID",
    "tin": "2320613923",
    "accountStatus": "linked",
    "phoneNumber": "8035757811",
    "lga": "N/A",
    "address": "OPP BUKURU NITEL"
  },
  {
    "id": 399871,
    "name": "JONATHAN LYDIA",
    "tin": "2320607899",
    "accountStatus": "linked",
    "phoneNumber": "8039705912",
    "lga": "N/A",
    "address": "ZARMAGANDA DIYE"
  },
  {
    "id": 399872,
    "name": "MWANGWONG MONDAY BITRUS",
    "tin": "2320608277",
    "accountStatus": "linked",
    "phoneNumber": "8102644571",
    "lga": "N/A",
    "address": "ST.JOHN CATHOLIC CHURCH TURU VWANG"
  },
  {
    "id": 399873,
    "name": "DAKOP MANDI",
    "tin": "2320613947",
    "accountStatus": "linked",
    "phoneNumber": "8108988365",
    "lga": "N/A",
    "address": "COCIN CHURCH CHAMBER ZARMAGANDA JOS"
  },
  {
    "id": 399874,
    "name": "ASHIBI CLEMENT ABRIBA",
    "tin": "2320608279",
    "accountStatus": "linked",
    "phoneNumber": "8061625391",
    "lga": "N/A",
    "address": "OPPOSITE GIDO PRIVATE SCHOOL ANGWAN DABA BUKURU"
  },
  {
    "id": 399875,
    "name": "OGBU MICHAEL THOMAS",
    "tin": "2320609066",
    "accountStatus": "linked",
    "phoneNumber": "7068715451",
    "lga": "N/A",
    "address": "BEHIND M AND B MED. DOROWA ZAWAN"
  },
  {
    "id": 399876,
    "name": "BAKO EUNICE",
    "tin": "2320609747",
    "accountStatus": "linked",
    "phoneNumber": "08168219180",
    "lga": "JOS NORTH",
    "address": "ANGWAN KAJI, DONG, JOS NORTH, Riyom, GANAWURI"
  },
  {
    "id": 399877,
    "name": "DAHIRU ISA",
    "tin": "2320607656",
    "accountStatus": "linked",
    "phoneNumber": "7030680029",
    "lga": "jos south",
    "address": "BESIDE AVIS YAKUBU GOWON WAY JOS"
  },
  {
    "id": 399878,
    "name": "DANIEL PRINCESS GLORIA",
    "tin": "2320609852",
    "accountStatus": "linked",
    "phoneNumber": "8188261751",
    "lga": "jos south",
    "address": "JOS"
  },
  {
    "id": 399879,
    "name": "NWOKIKE RICHARD NWABUDIKE",
    "tin": "2320611012",
    "accountStatus": "linked",
    "phoneNumber": "8033621107",
    "lga": "jos south",
    "address": "unity lane dadin kowa jos south"
  },
  {
    "id": 399880,
    "name": "OMACHI KABIRU",
    "tin": "2320607904",
    "accountStatus": "linked",
    "phoneNumber": "8142551333",
    "lga": "N/A",
    "address": "NO 40B UNITY LANE DADIN KOWA"
  },
  {
    "id": 399881,
    "name": "EWANSIHA JOHN AGHA",
    "tin": "2320608917",
    "accountStatus": "linked",
    "phoneNumber": "8037862826",
    "lga": "EDO",
    "address": "RANTYA STATE LOWCOST JOS SOUTH LGA"
  },
  {
    "id": 399882,
    "name": "HAGGAI D LONGS",
    "tin": "2320613966",
    "accountStatus": "linked",
    "phoneNumber": "8136564983",
    "lga": "N/A",
    "address": "BLOCK 250 STATE LOW COST MIANGO ROAD"
  },
  {
    "id": 399883,
    "name": "SIMON DAVID GOLU",
    "tin": "2320611032",
    "accountStatus": "linked",
    "phoneNumber": "8035886045",
    "lga": "N/A",
    "address": "NEW ABUJA JOS(MUNGYEL RAMUNG)"
  },
  {
    "id": 399884,
    "name": "BAKO ESTHER NAANMAN",
    "tin": "2320611016",
    "accountStatus": "linked",
    "phoneNumber": "7068735542",
    "lga": "N/A",
    "address": "ANGLO JOS"
  },
  {
    "id": 399885,
    "name": "MUHAMMAD RABIU SAMBO",
    "tin": "2320614007",
    "accountStatus": "linked",
    "phoneNumber": "7062600180",
    "lga": "N/A",
    "address": "NO 5 DOGON KARFE, JOS"
  },
  {
    "id": 399886,
    "name": "KUNDERA CAROLINE VANESSA",
    "tin": "2320614008",
    "accountStatus": "linked",
    "phoneNumber": "8067295463",
    "lga": "N/A",
    "address": "TRENCHSKY APARTMENTS OFF RAYFIELD RESORT ROAD RAYFIELD JOS"
  },
  {
    "id": 399887,
    "name": "UGBOMOR CHIDINMA JESSICA",
    "tin": "2320607894",
    "accountStatus": "linked",
    "phoneNumber": "8172699889",
    "lga": "N/A",
    "address": "NO:4 MUNGYEL BUILDING MATERIALS"
  },
  {
    "id": 399892,
    "name": "AGOREHOR JENIFER",
    "tin": "2320611047",
    "accountStatus": "linked",
    "phoneNumber": "8065867987",
    "lga": "N/A",
    "address": "NO 22 KUFANG MIANGO ROAD"
  },
  {
    "id": 399893,
    "name": "PETER ANDREW MA'AJI",
    "tin": "2320614045",
    "accountStatus": "linked",
    "phoneNumber": "7038896810",
    "lga": "N/A",
    "address": "TUDUN WADA RING ROAD HWOLSHE"
  },
  {
    "id": 399894,
    "name": "OSHO BUNMI MARY",
    "tin": "2320614046",
    "accountStatus": "linked",
    "phoneNumber": "8035874177",
    "lga": "BARKI",
    "address": "PLOT 11302 LOMAY ROAD SABON BARKI"
  },
  {
    "id": 399895,
    "name": "ONYENEKWE MALACHY NNAEMEKA",
    "tin": "2320608274",
    "accountStatus": "linked",
    "phoneNumber": "8065419652",
    "lga": "JOS SOUTH",
    "address": "OPP TCNN RAHWOL KANANG JOS SOUTH"
  },
  {
    "id": 399896,
    "name": "OLUOHA IKECHUKWU GODWIN",
    "tin": "2320608587",
    "accountStatus": "linked",
    "phoneNumber": "8034100655",
    "lga": "N/A",
    "address": "NO.66 8TH AVENUE FEDERAL LOWCOST JOS"
  },
  {
    "id": 399897,
    "name": "MIDAH MARKUS SIMON",
    "tin": "2320611051",
    "accountStatus": "linked",
    "phoneNumber": "8060359996",
    "lga": "JOS SOUTH",
    "address": "ANGWAN DABA JOS SOUTH"
  },
  {
    "id": 399898,
    "name": "DAVOU STEPHEN MANCHA",
    "tin": "2320611053",
    "accountStatus": "linked",
    "phoneNumber": "8032449666",
    "lga": "N/A",
    "address": "ZARAMAGANDA DIYE KENG"
  },
  {
    "id": 399899,
    "name": "AJIJI AGWOM AZI",
    "tin": "2320607877",
    "accountStatus": "linked",
    "phoneNumber": "8100652352",
    "lga": "N/A",
    "address": "ECWA STAFF NEW GRA JOS"
  },
  {
    "id": 399900,
    "name": "LOHGA NIMFA",
    "tin": "2320608268",
    "accountStatus": "linked",
    "phoneNumber": "7067816487",
    "lga": "N/A",
    "address": "STATE LOWCOST JOS."
  },
  {
    "id": 399901,
    "name": "DIDO PAULINA DAVID",
    "tin": "2320611055",
    "accountStatus": "linked",
    "phoneNumber": "7060643666",
    "lga": "N/A",
    "address": "COCIN LCC TYA"
  },
  {
    "id": 399902,
    "name": "DAVOU CHUNG DAVOU",
    "tin": "2320614093",
    "accountStatus": "linked",
    "phoneNumber": "8038493724",
    "lga": "JOS SOUTH ",
    "address": "BAH GAFANG GYEL JOS SOUTH PLATEAU SOUTH"
  },
  {
    "id": 399903,
    "name": "SAMUEL KAYI BADUNG",
    "tin": "2320607883",
    "accountStatus": "linked",
    "phoneNumber": "8120646553",
    "lga": "BARKI",
    "address": "EXPRESS WAY BUKURU"
  },
  {
    "id": 399904,
    "name": "PAM ABIGAIL KANENG",
    "tin": "2320611064",
    "accountStatus": "linked",
    "phoneNumber": "7035635985",
    "lga": "N/A",
    "address": "LO - GYANG ZANG NO.1 ROKPANK DU OPPOSITE COCIN KUNG"
  },
  {
    "id": 399905,
    "name": "MOSES MONDAY PAM",
    "tin": "2320611065",
    "accountStatus": "linked",
    "phoneNumber": "8034081801",
    "lga": "N/A",
    "address": "OPPOSITE SCIENCE SCHOOL DANCHOL KURU"
  },
  {
    "id": 399906,
    "name": "KITNANKA STEPHEN EZEKIEL",
    "tin": "2320609674",
    "accountStatus": "linked",
    "phoneNumber": "08033450674",
    "lga": "N/A",
    "address": "BEHIND GAMI HOTEL BUKURU LOWCOST"
  },
  {
    "id": 399907,
    "name": "SOLOMON INNOCENT TYNOGU",
    "tin": "2320614112",
    "accountStatus": "linked",
    "phoneNumber": "7066835747",
    "lga": "N/A",
    "address": "D.B ZANG JUNCTION BUKURU JOS SOUTH"
  },
  {
    "id": 399908,
    "name": "JUNA SARAH JOSHUA",
    "tin": "2320608262",
    "accountStatus": "linked",
    "phoneNumber": "7030084840",
    "lga": "N/A",
    "address": "BUKURU LOWCOST, BUKURU"
  },
  {
    "id": 399909,
    "name": "DAUDA ABDULLAHI",
    "tin": "2320608698",
    "accountStatus": "linked",
    "phoneNumber": "8039183546",
    "lga": "N/A",
    "address": "NEW LAYOUT BUKURU JOS SOUTH"
  },
  {
    "id": 399910,
    "name": "YENLE NANDI MICHAEL",
    "tin": "2320608586",
    "accountStatus": "linked",
    "phoneNumber": "8163657946",
    "lga": "N/A",
    "address": "RAMUN GYEL SABON BARKI JOS SOUTH"
  },
  {
    "id": 399911,
    "name": "NDACE BALA",
    "tin": "2320623287",
    "accountStatus": "linked",
    "phoneNumber": "8035784721",
    "lga": "N/A",
    "address": "NO 37 YELWA CLUB, "
  },
  {
    "id": 399912,
    "name": "PAM STEPHEN DUNG",
    "tin": "2320608175",
    "accountStatus": "linked",
    "phoneNumber": "8031315525",
    "lga": "N/A",
    "address": "ANGWAN GADA"
  },
  {
    "id": 399913,
    "name": "MOHAMMED SHITTU",
    "tin": "2320609667",
    "accountStatus": "linked",
    "phoneNumber": "8036908226",
    "lga": "N/A",
    "address": "NIGERIAN AIRFORCE JOS"
  },
  {
    "id": 399914,
    "name": "ADETUNJI ADEBAMJO SAMUEL",
    "tin": "2320611514",
    "accountStatus": "linked",
    "phoneNumber": "7037265123",
    "lga": "Jos North",
    "address": "NO 50 YAKUBU GWON WAY JOS."
  },
  {
    "id": 399915,
    "name": "JAN KAMJI",
    "tin": "2320611079",
    "accountStatus": "linked",
    "phoneNumber": "8069654559",
    "lga": "Jos South",
    "address": "NO.C7 NYANGO BUKURU LOWCOST"
  },
  {
    "id": 399916,
    "name": "MANCHA PAULINA JOSEPH",
    "tin": "2320609549",
    "accountStatus": "linked",
    "phoneNumber": "8036602277",
    "lga": "Bassa",
    "address": "MARARABAN JAMA'A"
  },
  {
    "id": 399917,
    "name": "MANGUT JOEL",
    "tin": "2320611073",
    "accountStatus": "linked",
    "phoneNumber": "8036358561",
    "lga": "Shendam",
    "address": "NO. 11 GOLD AND BASE RAYFIELD, JOS"
  },
  {
    "id": 399918,
    "name": "OFURIE OKIE KEN",
    "tin": "2320614134",
    "accountStatus": "linked",
    "phoneNumber": "8036535210",
    "lga": "Jos East",
    "address": "BEHIND AIRFORCE BASE JOS"
  },
  {
    "id": 399919,
    "name": "ASHAOLU SUNDAY OLABANJU GABRIEL",
    "tin": "2320611090",
    "accountStatus": "linked",
    "phoneNumber": "8035919927",
    "lga": "Langtang North",
    "address": "no.2 taylor's quarters nvri vom"
  },
  {
    "id": 399920,
    "name": "AMODU VICTORIA ELEOJO",
    "tin": "2320611143",
    "accountStatus": "linked",
    "phoneNumber": "8059498805",
    "lga": "Kanam",
    "address": "NO.10 NIVEN STREET MIANGO ROAD JOS"
  },
  {
    "id": 399921,
    "name": "JOSIPHERS DANIEL MWANTU",
    "tin": "2320607658",
    "accountStatus": "linked",
    "phoneNumber": "78063742267",
    "lga": "Bokkos",
    "address": "BUKURU JOS SOUTH"
  },
  {
    "id": 399922,
    "name": "DALYOP DAVID DANIEL",
    "tin": "2320608987",
    "accountStatus": "linked",
    "phoneNumber": "80696515610",
    "lga": "Kanke",
    "address": "MUN-GYEL VILLAGE OF JOS SOUTH LGA PLATEAU STATE"
  },
  {
    "id": 399923,
    "name": "BASIR NUSI",
    "tin": "2320609504",
    "accountStatus": "linked",
    "phoneNumber": "7037749041",
    "lga": "Mangu",
    "address": "HOUSE ON THE ROCK MIANGO JUNCTION JOS"
  },
  {
    "id": 399924,
    "name": "NYAM KENNETH PETER",
    "tin": "2320611103",
    "accountStatus": "linked",
    "phoneNumber": "8102812825",
    "lga": "Pankshin",
    "address": "LO-RENG OPPOSITE FOOTBALL FIELD RATYI DU"
  },
  {
    "id": 399925,
    "name": "WASH HARUNA DUNG",
    "tin": "2320611101",
    "accountStatus": "linked",
    "phoneNumber": "8185709071",
    "lga": "Barkin Ladi",
    "address": "COCIN LCC RAKUBELLANG SABON BARKI"
  },
  {
    "id": 399926,
    "name": "FELIX OGBONNA EZEKE",
    "tin": "2320611099",
    "accountStatus": "linked",
    "phoneNumber": "8065941417",
    "lga": "Jos North",
    "address": "NO 2B VOM ROAD KURU"
  },
  {
    "id": 399927,
    "name": "NAANYANG AUGUSTINA JONATHAN",
    "tin": "2320608261",
    "accountStatus": "linked",
    "phoneNumber": "7036230446",
    "lga": "Jos South",
    "address": "CHURCH OF ASSUMPTION SABON BARKI, JOS"
  },
  {
    "id": 399928,
    "name": "OLUWADARE MODUPE LOLA",
    "tin": "2320610047",
    "accountStatus": "linked",
    "phoneNumber": "7031941700",
    "lga": "Bassa",
    "address": "SHAAKA VILLAGE OPPOSITE COCIN OFF GOLD AND BASE"
  },
  {
    "id": 399929,
    "name": "SHUAIB OLUBUKOLA SULIAT",
    "tin": "2320609754",
    "accountStatus": "linked",
    "phoneNumber": "8051911862",
    "lga": "Kanam",
    "address": "JOS SOUTH"
  },
  {
    "id": 399930,
    "name": "GOMMAM SOHLAM JOSEPH",
    "tin": "2320611765",
    "accountStatus": "linked",
    "phoneNumber": "8038443854",
    "lga": "Bokkos",
    "address": "C/O COCIN LCC GIGIRING HWOLSHE JOS SOUTH LGA"
  },
  {
    "id": 399931,
    "name": "PAM TEYEI JOEL",
    "tin": "2320611111",
    "accountStatus": "linked",
    "phoneNumber": "7032954709",
    "lga": "Shendam",
    "address": "#14A NAOMI JUGU DRIVE RAYFIELD, JOS"
  },
  {
    "id": 399932,
    "name": "FREDERICK CHIGBUNDU",
    "tin": "2320611116",
    "accountStatus": "linked",
    "phoneNumber": "8069296190",
    "lga": "Mangu",
    "address": "BEHINDE PHCN OFFICE BUKURU"
  },
  {
    "id": 399933,
    "name": "OKPE OGO CHUKWU",
    "tin": "2320608255",
    "accountStatus": "linked",
    "phoneNumber": "7066061439",
    "lga": "Pankshin",
    "address": "NGO HANATU CHOOLOM STREET JOS OUTH"
  },
  {
    "id": 399934,
    "name": "OTOBO ITODO",
    "tin": "2320607962",
    "accountStatus": "linked",
    "phoneNumber": "8086779868",
    "lga": "Barkin Ladi",
    "address": "NO MM 28B ANGUL D"
  },
  {
    "id": 399935,
    "name": "RAPHAEL-UZOMAH ABIOLA OLAIDE",
    "tin": "2320609835",
    "accountStatus": "linked",
    "phoneNumber": "8026494253",
    "lga": "Jos North",
    "address": "OFF ATIKU ROAD, RAYFIELD JOS"
  },
  {
    "id": 399936,
    "name": "DAVOU SUNDAY OBED",
    "tin": "2320611123",
    "accountStatus": "linked",
    "phoneNumber": "8033537676",
    "lga": "Jos South",
    "address": "KUKUN DAHWOL DANGWONG ZAWAN JOS SOUTH"
  },
  {
    "id": 399937,
    "name": "PAM EZEKIEL AYUBA",
    "tin": "2320607389",
    "accountStatus": "linked",
    "phoneNumber": "7030323746",
    "lga": "Bassa",
    "address": "COCIN LCC DASHIK"
  },
  {
    "id": 399938,
    "name": "NIMRAM COMFORT DADI",
    "tin": "2320607901",
    "accountStatus": "linked",
    "phoneNumber": "9034173812",
    "lga": "Kanam",
    "address": "KWATA ZAWAN JOS SOUTH"
  },
  {
    "id": 399939,
    "name": "YAKUBU REUBEN",
    "tin": "2320609044",
    "accountStatus": "linked",
    "phoneNumber": "8119355022",
    "lga": "Mangu",
    "address": "MANGU LGA"
  },
  {
    "id": 399940,
    "name": "CHINSIDA FELICIA NANGPONEN",
    "tin": "2320609164",
    "accountStatus": "linked",
    "phoneNumber": "7032298119",
    "lga": "Pankshin",
    "address": "NEAR ECWA CHURCH, DADIN KOWA"
  },
  {
    "id": 399941,
    "name": "PARMAK APOLLOS",
    "tin": "2320609751",
    "accountStatus": "linked",
    "phoneNumber": "8088394026",
    "lga": "Shendam",
    "address": "C/O COCIN MANGO ROAD KUFANG, JOS"
  },
  {
    "id": 399942,
    "name": "ALAMBA NEHEMIAH DAHWOL",
    "tin": "2320607415",
    "accountStatus": "linked",
    "phoneNumber": "8060923115",
    "lga": "Bokkos",
    "address": "NO. 27 GYEL BUKURU"
  },
  {
    "id": 399943,
    "name": "DANIEL NAOMI AKUTE",
    "tin": "2320611772",
    "accountStatus": "linked",
    "phoneNumber": "7037705949",
    "lga": "Jos South",
    "address": "AYI MAI MASA BANDE JUNCTION ANGWAN DOKI JOS SOUTH"
  },
  {
    "id": 399944,
    "name": "ABUBAKAR ABDULLAHI JAMILA",
    "tin": "2320607564",
    "accountStatus": "linked",
    "phoneNumber": "8028733662",
    "lga": "Riyom",
    "address": "NOT22 ABATTOIR DOGON FARFE JOS"
  },
  {
    "id": 399945,
    "name": "GIMBA PIUS JAMES",
    "tin": "2320611131",
    "accountStatus": "linked",
    "phoneNumber": "8065491169",
    "lga": "Bokkos",
    "address": "TRADE CENTRE KURU"
  },
  {
    "id": 399946,
    "name": "ADAMU ISYAKU ABUBAKAR",
    "tin": "2320607662",
    "accountStatus": "linked",
    "phoneNumber": "8099677008",
    "lga": "Jos North",
    "address": "NO. 60 TUDUN O.O RIKKOS JOS NORTH LOCAL GOVERNMENT AREA PLATEAU STATE"
  },
  {
    "id": 399947,
    "name": "MANU MARY MANU",
    "tin": "2320611142",
    "accountStatus": "linked",
    "phoneNumber": "8106635696",
    "lga": "Jos South",
    "address": "RANTYA STATE LOWCOST JOS SOUTH"
  },
  {
    "id": 399948,
    "name": "ATILOLA OJO",
    "tin": "2320607728",
    "accountStatus": "linked",
    "phoneNumber": "8030600326",
    "lga": "OYO",
    "address": "DADIN KOWA JOS FIRST GATE"
  },
  {
    "id": 399949,
    "name": "OSHINEYE JOSEPH OLUFAYO",
    "tin": "2320611135",
    "accountStatus": "linked",
    "phoneNumber": "8033786106",
    "lga": "Jos South",
    "address": "NO.B2T ZARAMAGANDA JOS SOUTH LGA"
  },
  {
    "id": 399950,
    "name": "NANBOL PONGWANG DANVON",
    "tin": "2320614234",
    "accountStatus": "linked",
    "phoneNumber": "7064970047",
    "lga": "Jos",
    "address": "HWOLSHE,JOS"
  },
  {
    "id": 399951,
    "name": "BENJAMIN KILYOBAS LUKA",
    "tin": "2320609201",
    "accountStatus": "linked",
    "phoneNumber": "7036356875",
    "lga": "Barkin Ladi",
    "address": "NEAR COCIN CHURCH RAHWOL RAMUN NEW ABUJA"
  },
  {
    "id": 399952,
    "name": "ASUQUO IDONGESIT EJIGA",
    "tin": "2320609926",
    "accountStatus": "linked",
    "phoneNumber": "8060869039",
    "lga": "AKWA IBOM",
    "address": "DOROWA"
  },
  {
    "id": 399953,
    "name": "MIRI EMMANUEL ZINKAT",
    "tin": "2320608983",
    "accountStatus": "linked",
    "phoneNumber": "8037195252",
    "lga": "Jos North",
    "address": "NO.2 BEHIND NESCO-SUB STATION GURA TOPP RAYFIELD"
  },
  {
    "id": 399954,
    "name": "GOSHI RITKATMWA JONATHAN",
    "tin": "2320608187",
    "accountStatus": "linked",
    "phoneNumber": "8136905601",
    "lga": "Jos South",
    "address": "GSTC BUKURU JOS"
  },
  {
    "id": 399955,
    "name": "GLONG MASHAK DAGU",
    "tin": "2320609863",
    "accountStatus": "linked",
    "phoneNumber": "8038926410",
    "lga": "Shendam",
    "address": "C/O COCIN LCC KWATA ZAWAN"
  },
  {
    "id": 399956,
    "name": "BANYIGYI JOSEPH SHEKWONYADU",
    "tin": "2320609893",
    "accountStatus": "linked",
    "phoneNumber": "8129892153",
    "lga": "Bassa",
    "address": "KURU JOS SOUTH"
  },
  {
    "id": 399957,
    "name": "DALYOP STEPHEN SABO",
    "tin": "2320609904",
    "accountStatus": "linked",
    "phoneNumber": "8036547810",
    "lga": "Jos South",
    "address": "C/O ST. JOHN'S CATHOLIC CHURCH TURU"
  },
  {
    "id": 399958,
    "name": "GOTUS PAUL NJINA",
    "tin": "2320608251",
    "accountStatus": "linked",
    "phoneNumber": "8032443524",
    "lga": "Jos East",
    "address": "YINGI, NEW LAYOUT RAYFIELD"
  },
  {
    "id": 399959,
    "name": "JOHN DETBIS PRECIOUS",
    "tin": "2320609533",
    "accountStatus": "linked",
    "phoneNumber": "7032893025",
    "lga": "Jos South",
    "address": "BUKURU LOW-COST, JOS"
  },
  {
    "id": 399960,
    "name": "RABIU BINTA IBRAHIM",
    "tin": "2320609987",
    "accountStatus": "linked",
    "phoneNumber": "8035989975",
    "lga": "Barkin Ladi",
    "address": "K47 NEW LAYOUT BUKURU"
  },
  {
    "id": 399961,
    "name": "DUNG DAVID",
    "tin": "2320607638",
    "accountStatus": "linked",
    "phoneNumber": "8034419041",
    "lga": "Riyom",
    "address": "ZARMANGANDA."
  },
  {
    "id": 399962,
    "name": "GUYIT NANBAL GABRIEL",
    "tin": "2320607339",
    "accountStatus": "linked",
    "phoneNumber": "7035334526",
    "lga": "Mangu",
    "address": "NO.45 STATE LOW COST HOUSING MANGU"
  },
  {
    "id": 399963,
    "name": "ADAMU MARY PATRICK",
    "tin": "2320611154",
    "accountStatus": "linked",
    "phoneNumber": "7030503186",
    "lga": "Jos North",
    "address": "INDUSTIRAL LAYOUT OLD AIRPORT ROAD JOS SOUTH LGA"
  },
  {
    "id": 399964,
    "name": "ODOgun Waterside OLAMILEKAN OLA",
    "tin": "2320608252",
    "accountStatus": "linked",
    "phoneNumber": "8109002755",
    "lga": "Jos South",
    "address": "DOROWA BUKURU"
  },
  {
    "id": 399965,
    "name": "AMWE JOSEPHINE KANGYANG",
    "tin": "2320614317",
    "accountStatus": "linked",
    "phoneNumber": "8037118600",
    "lga": "Barkin Ladi",
    "address": "ZEK ZAWAN,JOS."
  },
  {
    "id": 399966,
    "name": "ANYANWU DANIEL CHINEDU",
    "tin": "2320614319",
    "accountStatus": "linked",
    "phoneNumber": "7039159070",
    "lga": "Jos East",
    "address": "DADIN KOWA ANGWAN BAKI OPPOSITE CAC CHURCH"
  },
  {
    "id": 399967,
    "name": "SHUT LARABA CHUNG",
    "tin": "2320607736",
    "accountStatus": "linked",
    "phoneNumber": "7038103282",
    "lga": "Bokkos",
    "address": "C/O COCIN CHURCH DAHOL DANGWONG(DOROWA)ZAWAN"
  },
  {
    "id": 399968,
    "name": "SUNKUR SUMAKANA DANIEL",
    "tin": "2320609911",
    "accountStatus": "linked",
    "phoneNumber": "8069579300",
    "lga": "Jos South",
    "address": "DADIN KOWA ANGWAN BAKI, JOS"
  },
  {
    "id": 399969,
    "name": "ZAMANI VIVIAN AISHA",
    "tin": "2320609527",
    "accountStatus": "linked",
    "phoneNumber": "8065115939",
    "lga": "Jos North",
    "address": "T14 DOGON KARFE, BEHIND NNPC MEGA STATION, JOS"
  },
  {
    "id": 399970,
    "name": "UGWU STEPHEN ONYEMACHI",
    "tin": "2320608242",
    "accountStatus": "linked",
    "phoneNumber": "8036321588",
    "lga": "Shendam",
    "address": "Gwarandok village Abattoir jos"
  },
  {
    "id": 399971,
    "name": "DUNG PETER ABRAHAM",
    "tin": "2320607423",
    "accountStatus": "linked",
    "phoneNumber": "8036261434",
    "lga": "Pankshin",
    "address": "DIYE THWOT JOS"
  },
  {
    "id": 399972,
    "name": "EZEKIEL GAMBO JOY",
    "tin": "2320608253",
    "accountStatus": "linked",
    "phoneNumber": "8160152166",
    "lga": "Langtang South",
    "address": "BWANDANG BEHIND BOARD OF INTERNAL REVENUE"
  }

]

const enumerated = urlParams.get('enumerated')
let userrrData = {}

let theUSerss = usersName.find((userIdolo => userIdolo.id === parseInt(userIdo)))

let theimg = "./assets/img/avatars/1.png"

$("#userInfo").html(`
    <div class="flex gap-x-2">
    <img src="${theimg}" class="h-[70px] w-[70px] object-cover rounded-full" />
    <div class="mt-2">
    <h6 class="font-bold text-[20px]">${theUSerss.name}</h6>
    <p><span class="font-bold">TIN:</span> ${theUSerss.tin}</p>
    </div>
    </div>
      <div class="flex flex-wrap gap-x-5 gap-y-3 mt-2">
        <p><span class="font-bold">User ID:</span> PSIRS-${theUSerss.id}</p>
        <p><span class="font-bold">Category:</span> -</p>
        <p><span class="font-bold">State:</span> Plateau</p>
        <p><span class="font-bold">LGA:</span> ${theUSerss.lga}</p>
        <p><span class="font-bold">Address:</span> ${theUSerss.address}</p>
        <p><span class="font-bold">Email address:</span> ${theUSerss.name.replaceAll(' ', '').toLowerCase() + '@gmail.com'}</p>
        <p><span class="font-bold">Contact:</span> ${theUSerss.phoneNumber}</p>
      </div>
`)

$(".dataTable").DataTable();
// $(".dataTable2").DataTable();

$("#showPayment").append(`
  <tr>
    <td>${theUSerss.id}</td>
    <td>214240206459608</td>
    <td>Accommodation fee(all tertiary institutions)</td>
    <td>NGN 100.00</td>
    <td>PayStack</td>
    <td><span class="badge bg-success">Paid</span></td>
  </tr>

  <tr>
    <td>${theUSerss.id}</td>
    <td>T217171481658549</td>
    <td>Development Levy	</td>
    <td>NGN 200.00</td>
    <td>PayStack</td>
    <td><span class="badge bg-success">Paid</span></td>
  </tr>

  <tr>
    <td>${theUSerss.id}</td>
    <td>T217171481658549</td>
    <td>Withholding Tax on Rents</td>
    <td>NGN 63,000.00</td>
    <td>PayStack</td>
    <td><span class="badge bg-success">Paid</span></td>
  </tr>
`)


function exportTablee(element, thetable) {
  $("#" + element).tableHTMLExport({
    // csv, txt, json, pdf
    type: 'csv',
    // file name
    filename: 'report.csv'
  });
}


async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}

async function getTaxesCateg() {
  const response = await fetch(`${HOST}?getAllRevenueHeads`)
  const revenueHeads = await response.json()

  // console.log(revenueHeads)

  let ii = 0

  revenueHeads.message.forEach((revenuehead, i) => {
    $("#showAllTaxes").append(`
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="">
          </div>
        </td>
        <td>${revenuehead["COL_3"]}</td>
        <td>${revenuehead["COL_4"]}</td>
        <td>GENERAL</td>
        <td>${revenuehead["COL_5"]}</td>
        <td>Yes</td>
        <td>One-off</td>
        <td>${revenuehead["COL_6"]}</td>
      </tr>
    `)
  })

}

getTaxesCateg()


async function getAnalytics() {
  try {

    const response = await fetch(`${HOST}?inAppNotification&user_id=${userIdo}`)
    const data = await response.json()
    console.log(data)
    if (data.status === 0) {
      $("#ActivityLogs").html(``)

    } else {
      // <button class="text-[#CDA545] text-[12px] underline underline-offset-1">clear</button>

      data.message.forEach((notification, i) => {
        $("#ActivityLogs").append(`
        <tr>
          <td>${notification.timeIn}</td>
          <td>${notification.comment}</td>
        </tr>
      `)

      });


    }

  } catch (error) {
    console.log(error)
  }
}

getAnalytics().then(ee => {
  $('#dataTable77').DataTable();
})
