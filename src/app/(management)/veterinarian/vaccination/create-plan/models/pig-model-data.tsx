const columns = [
  { name: "Mã heo", uid: "pigCode", sortable: true },
  { name: "Giống", uid: "breed", sortable: true },
  { name: "Đàn", uid: "herdId", sortable: true },
  { name: "Chuồng", uid: "cageId", sortable: true },
  { name: "Cân nặng", uid: "weight", sortable: true },
  { name: "Chiều cao", uid: "height", sortable: true },
  { name: "Chiều rộng", uid: "width", sortable: true },
  { name: "Tình trạng", uid: "healthStatus", sortable: true },
  { name: "Mã chuồng", uid: "cageCode", sortable: true },
  { name: "Cập nhật lần cuối", uid: "lastUpdatedAt", sortable: true },
  { name: "Ngày tiêm vaccin", uid: "vaccinationDate", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "breed",
  "weight",
  "height",
  "width",
  "healthStatus",
  "pigCode",
  "cageCode",
];

const statusOptions = [
  { name: "Khỏe mạnh", uid: "normal" },
  { name: "Bệnh", uid: "sick" },
  { name: "Chết", uid: "dead" },
];

export { columns, INITIAL_VISIBLE_COLUMNS, statusOptions };
