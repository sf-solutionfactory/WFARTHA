$(document).ready(function () {
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Inicializar las tabs
    $('#tabs').tabs();

    //Tabla de Retenciones
    //$('#table_ret').DataTable({
    //    scrollX: true,
    //    scrollCollapse: true,
    //    language: {
    //        "url": "../Scripts/lang/ES.json"
    //    },
    //    "paging": false,
    //    "info": false,
    //    "searching": false,
    //    "columns": [
    //        {
    //            "name": 'SOCRET',
    //            "className": 'SOCRET',
    //            "orderable": false,
    //            "visible": false
    //        },
    //        {
    //            "name": 'PROVRET',
    //            "className": 'PROVRET',
    //            "orderable": false,
    //            "visible": false
    //        },
    //        {
    //            "name": 'TRET',
    //            "className": 'TRET',
    //            "orderable": false
    //        },
    //        {
    //            "name": 'DESCRET',
    //            "className": 'DESCTRET',
    //            "orderable": false
    //        },
    //        {
    //            "name": 'INDRET',
    //            "className": 'INDRET',
    //            "orderable": false
    //        },
    //        {
    //            "name": 'BIMPONIBLE',
    //            "className": 'BIMPONIBLE',
    //            "orderable": false
    //        },
    //        {
    //            "name": 'IMPRET',
    //            "className": 'IMPRET',
    //            "orderable": false
    //        }
    //    ]
    //});
});