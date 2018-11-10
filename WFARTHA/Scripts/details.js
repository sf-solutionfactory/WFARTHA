//Variables globales
var firmaVal = "";

$(document).ready(function () {

    //Inicializar las tabs
    $('#tabs').tabs();

    //Iniciar todos los selects
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Tabla de Información
    $('#table_info').DataTable({
        scrollX: true,
        scrollCollapse: true,
        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        "columns": [
            {//MGC 30-10-2018 Tipo de presupuesto
                "className": 'select_row',
                "data": null,
                "defaultContent": '',
                "orderable": false,
                "visible": false //MGC 30-10-2018 Tipo de presupuesto
            },//MGC 30-10-2018 Tipo de presupuesto
            {
                "name": 'POS',
                "className": 'POS',
                "orderable": false
            },
            {
                "name": 'A1',
                "className": 'NumAnexo',
                "orderable": false
            },
            {
                "name": 'A2',
                "className": 'NumAnexo2',
                "orderable": false
            },
            {
                "name": 'A3',
                "className": 'NumAnexo3',
                "orderable": false
            },
            {
                "name": 'A4',
                "className": 'NumAnexo4',
                "orderable": false
            },
            {
                "name": 'A5',
                "className": 'NumAnexo5',
                "orderable": false
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
                "name": 'TXTPOS',
                "className": 'TXTPOS',
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
                    M.toast({ html: data });
                }
            },
            error: function (xhr, httpStatusMessage, customErrorMessage) {

            },
            async: false
        });

        document.getElementById("loader").style.display = "none";//RSG 26.04.2018

    });

    formatoMon();

    var val3 = $('#tsol').val();
    showHide(val3);
    
});

//Cuando se termina de cargar la página
$(window).on('load', function () {


});

function showHide(tsol) {
    var val3 = tsol;
    val3 = "[" + val3 + "]";
    val3 = val3.replace("{", "{ \"");
    val3 = val3.replace("}", "\" }");
    val3 = val3.replace(/\,/g, "\" , \"");
    val3 = val3.replace(/\=/g, "\" : \"");
    val3 = val3.replace(/\ /g, "");
    var jsval = $.parseJSON(val3)

    $.each(jsval, function (i, dataj) {
        ocultarCampos(dataj.EDITDET, param1);
    });

}

function formatoMon() {
    var table = $('#table_info').DataTable();
   // $("#table_info > tbody > tr[role = 'row']").each(function (index) {
        //var col11 = $(this).find("td.TOTAL input").val();
        //var col11 = $(this).find("td.TOTAL input").val();


        //col11 = col11.replace(/\s/g, '');
        //var val = toNum(col11);
        //val = convertI(val);
        //if ($.isNumeric(val)) {
        //    total += val;
        //}
  //  });
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

function ocultarCampos(opc, load) {
    //respuesta en minúscula
    opc = opc.toLowerCase();

    //Si load = "load" solo se ocultan o muestran campos

    if (opc === "true") {

        //Solicitud sin orden de compra
        $("#div_norden_compra").css("display", "none");

        if (load === "load") {
            //
        } else {
            $("#norden_compra").val("");
        }


    } else {
        //Solicitud con orden de compra
        $("#div_norden_compra").css("display", "inherit");

        if (load === "load") {
            //
        } else {
            $("#norden_compra").val("");
        }
    }

    //Deshabilitar campos de la tabla
    //ocultarColumnas(opc);
}


    //MGC 18-10-2018 Firma del usuario -------------------------------------------------->
    //Validar la firma del usuario

function valF(frmValues) {

    firmaVal = "";
    firmaVallocal = "";
    $.ajax({
        type: "POST",
        url: '../ValF',
        //dataType: "json",
        data: { "pws": frmValues },

        success: function (data) {

            asigF(data);
           
        },
        error: function (xhr, httpStatusMessage, customErrorMessage) {
            var a = xhr;
        },
        async: false
    });


    firmaVallocal = firmaVal;
    return firmaVallocal;
}

function asigF(fir) {
    firmaVal = fir;
}


//MGC 18-10-2018 Firma del usuario --------------------------------------------------<


