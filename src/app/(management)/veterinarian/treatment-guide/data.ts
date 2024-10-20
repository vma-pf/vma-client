const columns = [
  { name: "TÊN BỆNH", uid: "diseaseTitle", sortable: true },
  { name: "MÔ TẢ BỆNH", uid: "diseaseDescription", sortable: true },
  { name: "TRIỆU CHỨNG", uid: "diseaseSymptoms", sortable: true },
  { name: "TIÊU ĐỀ", uid: "treatmentTitle", sortable: true },
  { name: "MÔ TẢ", uid: "treatmentDescription", sortable: true },
  { name: "HƯỚNG DẪN CHỮA BỆNH", uid: "cure", sortable: true },
  { name: "MỨC ĐỘ", uid: "diseaseType", sortable: true },
  { name: "TẠO BỞI", uid: "authorName", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "diseaseTitle",
  "diseaseDescription",
  "diseaseSymptoms",
  "treatmentTitle",
  "treatmentDescription",
  "cure",
  "diseaseType",
  "authorName",
  "actions"
];

const statusOptions = [{ name: "", uid: "" }];

export { columns, statusOptions, INITIAL_VISIBLE_COLUMNS };
