const columns = [
    { name: "MÃ ĐÀN", uid: "code", sortable: true },
    { name: "GIỐNG", uid: "breed", sortable: true },
    { name: "SỐ LƯỢNG HEO", uid: "totalNumber", sortable: true },
    { name: "NGÀY NHẬP", uid: "startDate", sortable: true },
    { name: "NGÀY KẾT THÚC DỰ KIẾN", uid: "expectedEndDate", sortable: true },
    { name: "MÔ TẢ", uid: "description", sortable: true },
    { name: "TRẠNG THÁI ", uid: "status", sortable: true },
    { name: "", uid: "actions" },
  ];
  
  const INITIAL_VISIBLE_COLUMNS = [
    "code",
    "breed",
    "startDate",
    "expectedEndDate",
    "description",
    "status",
  ];
  
  const statusOptions = [{name: "", active: ""}];
  
  //mock
  const herds = [
    
  ];
  
  export { columns, herds, statusOptions, INITIAL_VISIBLE_COLUMNS };
  