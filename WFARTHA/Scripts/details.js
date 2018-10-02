
$(document).ready(function () {

    

    //Inicializar las tabs
    $('#tabs').tabs();

    //Iniciar todos los selects
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Tabla de Información
    $('#table_info').DataTable({

        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "columns": [
            {
                "name": 'POS',
                "className": 'POS',
                "orderable": false,
            },
            {
                "name": 'CA',
                "className": 'CA',
                "orderable": false
            },
            {
                "name": 'FACTURA',
                "className": 'FACTURA',
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
                "orderable": false
            },
            {
                "name": 'CUENTANOM',
                "className": 'CUENTANOM',
                "orderable": false
            },
            {
                "name": 'TIPOIMP',
                "className": 'TIPOIMP',
                "orderable": false
            },
            {
                "name": 'IMPUTACION',
                "className": 'IMPUTACION',
                "orderable": false

            },
            {
                "name": 'MONTO',
                "className": 'MONTO',
                "orderable": false
            },
            {
                "name": 'IVA',
                "className": 'IVA',
                "orderable": false
            },
            {
                "name": 'TOTAL',
                "className": 'TOTAL',
                "orderable": false
            }
        ]
    });

    $('#table_sop').DataTable({

        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "columns": [
            {
                "className": 'select_row',
                "data": null,
                "defaultContent": '',
                "orderable": false
            },
            {
                "name": 'OPC',
                "className": 'OPC',
                "orderable": false,
            },
            {
                "name": 'POS',
                "className": 'POS',
                "orderable": false,
            },
            {
                "name": 'RFC',
                "className": 'RFC',
                "orderable": false
            },
            {
                "name": 'FACTURA',
                "className": 'FACTURA',
                "orderable": false
            },
            {
                "name": 'FECHA',
                "className": 'FECHA',
                "orderable": false
            },

            {
                "name": 'MONTO',
                "className": 'MONTO',
                "orderable": false
            }
            ,
            {
                "name": 'IVA',
                "className": 'IVA',
                "orderable": false
            },
            {
                "name": 'TOTAL',
                "className": 'TOTAL',
                "orderable": false
            }
            ,
            {
                "name": 'ARCHIVO',
                "className": 'ARCHIVO',
                "orderable": false
            }
        ]
    });

    //Contabilizar
    $('#btn_cont').on("click", function () {
        document.getElementById("loader").style.display = "initial";//RSG 26.04.2018
        var num = $('#num_doc_send').val();

        $.ajax({
            type: "POST",
            url: '../../Flujos/Procesa',
            //dataType: "json",
            data: { "id": num },

            success: function (data) {

                if (data != null || data != "") {
                    M.toast({ html: data});
                }
            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {

            },
            async: false
        });

        document.getElementById("loader").style.display = "none";//RSG 26.04.2018

    });

    formatoMon();

});

//Cuando se termina de cargar la página
$(window).on('load', function () {


});


function formatoMon() {
    var table = $('#table_info').DataTable();
    $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        //var col11 = $(this).find("td.TOTAL input").val();
        //var col11 = $(this).find("td.TOTAL input").val();


        //col11 = col11.replace(/\s/g, '');
        //var val = toNum(col11);
        //val = convertI(val);
        //if ($.isNumeric(val)) {
        //    total += val;
        //}
    });
}

function updateFooter() {
    resetFooter();

    var t = $('#table_info').DataTable();
    var total = 0;

    $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        //var col11 = $(this).find("td.TOTAL input").val();
        var col11 = $(this).find("td.TOTAL input").val();


        col11 = col11.replace(/\s/g, '');
        var val = toNum(col11);
        val = convertI(val);
        if ($.isNumeric(val)) {
            total += val;
        }
    });

    total = total.toFixed(2);

    $('#total_info').text(toShow(total));


}

function convertI(i) {
    return typeof i === 'string' ?
        i.replace(/[\$,]/g, '') * 1 :
        typeof i === 'number' ?
            i : 0;
};

function resetFooter() {
    $('#total_info').text("$0");
}

function resetTabs() {

    var ell = document.getElementById("tabs");
    var instances = M.Tabs.getInstance(ell);
    
    var active = $('.tabs').find('.active').attr('href');
    active = active.replace("#", "");
    instances.select(active);
    //instances.updateTabIndicator
}







