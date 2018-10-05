$(document).ready(function () {
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Inicializar las tabs
    $('#tabs').tabs();

    //Tabla de Información
    $('#table_info').DataTable({

        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "scrollX": true,
        "columns": [
            {
                "className": 'select_row',
                "data": null,
                "defaultContent": '',
                "orderable": false
            },
            {
                "name": 'POS',
                "className": 'POS',
                "orderable": false,
                "visible": false //MGC 04092018 Conceptos
            },
            {
                "name": 'NumAnexo',
                "className": 'NumAnexo',
                "orderable": false
            },
            {
                "name": 'NumAnexo2',
                "className": 'NumAnexo2',
                "orderable": false
            },
            {
                "name": 'NumAnexo3',
                "className": 'NumAnexo3',
                "orderable": false
            },
            {
                "name": 'NumAnexo4',
                "className": 'NumAnexo4',
                "orderable": false
            },
            {
                "name": 'NumAnexo5',
                "className": 'NumAnexo5',
                "orderable": false
            },
            {
                "name": 'CA',
                "className": 'CA',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'FACTURA',
                "className": 'FACTURA',
                "orderable": false
            },
            {
                "name": 'TCONCEPTO',
                "className": 'TCONCEPTO',
                "orderable": false
            },
            {
                "name": 'GRUPO',
                "className": 'GRUPO',
                "orderable": false
            },
            {
                "name": 'CUENTA',
                "className": 'CUENTA',
                "orderable": false,
                "visible": false//lej 11.09.2018
            },
            {
                "name": 'CUENTANOM',
                "className": 'CUENTANOM',
                "orderable": false,
                "visible": false//lej 11.09.2018
            },
            {
                "name": 'TIPOIMP',
                "className": 'TIPOIMP',
                "orderable": false
            },
            {
                "name": 'IMPUTACION',
                "className": 'IMPUTACION',
                "orderable": false,
                "visible": false//lej 11.09.2018
            },
            {
                "name": 'CCOSTO',
                "className": 'CCOSTO',
                "orderable": false

            },
            {
                "name": 'MONTO',
                "className": 'MONTO',
                "orderable": false
            },
            {
                "name": 'IMPUESTO',
                "className": 'IMPUESTO',
                "orderable": false
            },
            {
                "name": 'IVA',
                "className": 'IVA',
                "orderable": false
            },
            {
                "name": 'TXTPOS',
                "className": 'TXTPOS',
                "orderable": false
            },
            {
                "name": 'TOTAL',
                "className": 'TOTAL',
                "orderable": false
            },
            //MGC ADD 03-10-2018 solicitud con orden de compra
            {
                "name": 'CHECK',
                "className": 'CHECK',
                "orderable": false
            }
        ]
    });
    solicitarDatos();
});

function solicitarDatos() {
    var _ref = $('#REFERENCIA').val();
    $.ajax({
        type: "POST",
        url: '../getDocsPSTR',
        dataType: "json",
        data: { 'id': _ref },
        success: function (data) {
            if (data !== null || data !== "") {
                if (data !== "Null") {
                    //
                    armarTablaInfo(data);
                }
                else {
                    //
                }
            }
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            M.toast({ html: httpStatusMessage });
        },
        async: false
    });
}

function armarTablaInfo(datos) {
    var valor = JSON.parse($('#_hd').val());
    $('#table_info').DataTable().destroy();
    $('#table_info').empty();
    var arrCols = [
        {
            "className": 'select_row',
            "data": null,
            "defaultContent": '',
            "orderable": false
        },
        {
            "name": 'POS',
            "className": 'POS',
            "orderable": false,
            "visible": false //MGC 04092018 Conceptos
        },
        {
            "name": 'NumAnexo',
            "className": 'NumAnexo',
            "orderable": false
        },
        {
            "name": 'NumAnexo2',
            "className": 'NumAnexo2',
            "orderable": false
        },
        {
            "name": 'NumAnexo3',
            "className": 'NumAnexo3',
            "orderable": false
        },
        {
            "name": 'NumAnexo4',
            "className": 'NumAnexo4',
            "orderable": false
        },
        {
            "name": 'NumAnexo5',
            "className": 'NumAnexo5',
            "orderable": false
        },
        {
            "name": 'CA',
            "className": 'CA',
            "orderable": false,
            "visible": false
        },
        {
            "name": 'FACTURA',
            "className": 'FACTURA',
            "orderable": false
        },
        {
            "name": 'TCONCEPTO',
            "className": 'TCONCEPTO',
            "orderable": false
        },
        {
            "name": 'GRUPO',
            "className": 'GRUPO',
            "orderable": false
        },
        {
            "name": 'CUENTA',
            "className": 'CUENTA',
            "orderable": false,
            "visible": false//lej 11.09.2018
        },
        {
            "name": 'CUENTANOM',
            "className": 'CUENTANOM',
            "orderable": false,
            "visible": false//lej 11.09.2018
        },
        {
            "name": 'TIPOIMP',
            "className": 'TIPOIMP',
            "orderable": false
        },
        {
            "name": 'IMPUTACION',
            "className": 'IMPUTACION',
            "orderable": false,
            "visible": false//lej 11.09.2018
        },
        {
            "name": 'CCOSTO',
            "className": 'CCOSTO',
            "orderable": false

        },
        {
            "name": 'MONTO',
            "className": 'MONTO',
            "orderable": false
        },
        {
            "name": 'IMPUESTO',
            "className": 'IMPUESTO',
            "orderable": false
        },
        {
            "name": 'IVA',
            "className": 'IVA',
            "orderable": false
        },
        {
            "name": 'TEXTO',
            "className": 'TEXTO',
            "orderable": false
        }
    ];
    for (var i = 0; i < datos.DOCUMENTOPSTR.length; i++) {
        alert(datos.DOCUMENTOPSTR[i].ACCION);

    }

}