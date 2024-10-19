const columns = [
  { name: "TÊN BỆNH", uid: "title", sortable: true },
  { name: "MÔ TẢ BỆNH", uid: "description", sortable: true },
  { name: "TRIỆU CHỨNG", uid: "symptoms", sortable: true },
  { name: "CÁCH CHỮA", uid: "treatment", sortable: true },
  { name: "MÔ TẢ", uid: "treatmentDescription", sortable: true },
  { name: "MỨC ĐỘ", uid: "diseaseType", sortable: true },
  { name: "TẠO LÚC", uid: "createdAt", sortable: true },
  { name: "CẬP NHẬT LÚC", uid: "lastUpdatedAt", sortable: true },
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
