const columns = [
  { name: "TÊN", uid: "name", sortable: true },
  {
    name: "THÀNH PHẦN CHÍNH",
    uid: "mainIngredient",
    sortable: true,
  },
  { name: "SỐ LƯỢNG", uid: "quantity", sortable: true },
  { name: "SỐ ĐĂNG KÝ", uid: "registerNumber", sortable: true },
  { name: "TRỌNG LƯỢNG", uid: "netWeight", sortable: true },
  { name: "TÌNH TRẠNG SỬ DỤNG", uid: "usage", sortable: true },
  { name: "ĐƠN VỊ", uid: "unit", sortable: true },
  { name: "LẦN CUỐI CẬP NHẬT", uid: "lastUpdatedAt", sortable: true },
  { name: "CẬP NHẬT BỞI", uid: "lastUpdatedBy", sortable: true },
  { name: "", uid: "actions" },
];

const statusOptions = [{ name: "Khỏe mạnh", uid: "active" }];

const medicines = [
  {
    id: "1",
    unit: "ABC",
    name: "Ten thuoc A",
    mainIngredient: "Chất gây ung thưacnsacnosans",
    quantity: 10,
    registerNumber: 123,
    netWeight: 123,
    usage: "123123",
    lastUpdatedAt: "2024-09-09",
    lastUpdatedBy: "tui",
  },
  {
    id: "2",
    unit: "ABC",
    name: "Ten thuoc A",
    mainIngredient: "Chất gây ung thưacnsacnosas",
    quantity: 10,
    registerNumber: 123,
    netWeight: 123,
    usage: "123123",
    lastUpdatedAt: "2024-09-09",
    lastUpdatedBy: "tui",
  },
];

export { columns, medicines, statusOptions };
