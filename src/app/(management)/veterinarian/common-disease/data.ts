const columns = [
  { name: "TÊN BỆNH", uid: "title", sortable: true },
  { name: "MÔ TẢ BỆNH", uid: "description", sortable: true },
  { name: "TRIỆU CHỨNG", uid: "symptom", sortable: true },
  { name: "MỨC ĐỘ", uid: "diseaseType", sortable: true },
  { name: "CÁCH CHỮA BỆNH", uid: "treatment", sortable: true },
  { name: "TẠO LÚC", uid: "createdAt", sortable: true },
  { name: "CẬP NHẬT LÚC", uid: "lastUpdatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "title",
  "description",
  "symptom",
  "diseaseType",
  "treatment",
  "createdAt",
  "lastUpdatedAt",
  "actions"
];

const statusOptions = [{ name: "", uid: "" }];

export { columns, statusOptions, INITIAL_VISIBLE_COLUMNS };
