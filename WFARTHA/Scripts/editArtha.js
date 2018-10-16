var tRet2 = [];
$(document).ready(function () {
    var elem = document.querySelectorAll('select');
    var instance = M.Select.init(elem, []);

    //Inicializar las tabs
    $('#tabs').tabs();

    solicitarDatos();
    $('#btn_guardarh').on("click", function (e) {

        //Termina provisional
        $('#btn_guardar').click();


    });
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
    //Se rearmara la tabla en HTML
    var taInf = $("#table_info");
    taInf.append($("<thead />"));
    taInf.append($("<tbody />"));
    taInf.append($("<tfoot />"));
    var thead = $("#table_info thead");
    thead.append($("<tr />"));
    //Theads
    $("#table_info>thead>tr").append("<th></th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_pos\">Pos NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo2</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo3</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo4</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_NmAnexo\">Anexo5</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_cargoAbono\">D/H NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_factura\">Factura NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_tconcepto\">TIPO CONCEPTO NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_grupo\">Grupo NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_cuenta\">Cuenta NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_cuentaNom\">Nombre de cuenta NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_tipoimp\">Tipo Imp. NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_imputacion\">Imputación NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_ccosto\">Centro de costo NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_monto\">Monto NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_impuesto\">Impuesto NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_iva\">IVA NT</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_Texto\">TEXTO</th>");
    var res = null;
    //----------------------
    //Hare un ajax para traer las columnas extras
    var _ref = $('#NUM_DOC').val();
    $.ajax({
        type: "POST",
        url: '../traerColsExtras',
        dataType: "json",
        data: { 'id': _ref },
        success: function (data) {
            if (data !== null || data !== "") {
                if (data !== "Null") {
                    //
                    res = data;
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
    var tRet = [];
    for (x = 0; x < res.length; x++) {
        tRet.push(res[x].WITHT);
    }
    //----------------------
    var colspan = 20;
    tRet2 = tRet;
    for (i = 0; i < tRet.length; i++) {//Revisare las retenciones que tienes ligadas
        $.ajax({
            type: "POST",
            url: '../getRetLigadas',
            data: { 'id': tRet[i] },
            dataType: "json",
            success: function (data) {
                if (data !== null || data !== "") {
                    if (data !== "Null") {
                        tRet2 = jQuery.grep(tRet2, function (value) {
                            return value !== data;
                        });
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

    for (i = 0; i < tRet2.length; i++) {//Agregare las columnas extras
        $("#table_info>thead>tr").append("<th class=\"\">" + tRet2[i] + "B. I.</th>");
        $("#table_info>thead>tr").append("<th class=\"\">" + tRet2[i] + "I. R.</th>");
        colspan++;
        colspan++;
    }
    $("#table_info>thead>tr").append("<th class=\"lbl_total\">Total</th>");
    $("#table_info>thead>tr").append("<th class=\"lbl_check\">Check</th>");
    //Tfoot       
    var tfoot = $("#table_info tfoot");
    tfoot.append($("<tr />"));
    $("#table_info>tfoot>tr").append("<th colspan=\"" + colspan + "\" style=\"text-align:right\">Total:</th>");
    $("#table_info>tfoot>tr").append("<th id=\"total_info\"></th>");
    //Se hara un push al arreglo de columnas original
    for (i = 0; i < tRet2.length; i++) {
        arrCols.push({
            "name": tRet2[i] + " B.Imp.",
            "orderable": false
        }, {
                "name": tRet2[i] + " I. Ret.",
                "orderable": false
            });
    }
    //Lej 17.09.18
    //Para agregar columna texto al final
    arrCols.push({
        "name": 'TOTAL',
        "className": 'TOTAL',
        "orderable": false
    });
    //solicitud con orden de compra
    arrCols.push({
        "name": 'CHECK',
        "className": 'CHECK',
        "orderable": false
    });

    //Lej 17.09.18
    extraCols = tRet2.length;
    $('#table_info').DataTable({
        scrollX: true,
        scrollCollapse: true,
        language: {
            "url": "../Scripts/lang/ES.json"
        },
        "destroy": true,
        "paging": false,
        "info": false,
        "searching": false,
        "columns": arrCols
    });
    for (var i = 0; i < datos.DOCUMENTOPSTR.length; i++) {
        addRowInfo($('#table_info').DataTable(), datos.DOCUMENTOPSTR[i].POS, "", "", "", "", "", datos.DOCUMENTOPSTR[i].ACCION, datos.DOCUMENTOPSTR[i].FACTURA, "", datos.DOCUMENTOPSTR[i].GRUPO, datos.DOCUMENTOPSTR[i].CUENTA,
            datos.DOCUMENTOPSTR[i].NOMCUENTA, datos.DOCUMENTOPSTR[i].TIPOIMP, datos.DOCUMENTOPSTR[i].IMPUTACION, "", datos.DOCUMENTOPSTR[i].MONTO, "", datos.DOCUMENTOPSTR[i].IVA, datos.DOCUMENTOPSTR[i].TEXTO, datos.DOCUMENTOPSTR[i].TOTAL, "", "");
    }

}

function addRowInfo(t, POS, NumAnexo, NumAnexo2, NumAnexo3, NumAnexo4, NumAnexo5, CA, FACTURA, TIPO_CONCEPTO, GRUPO, CUENTA, CUENTANOM, TIPOIMP, IMPUTACION, CCOSTO, MONTO, IMPUESTO, IVA, TEXTO, TOTAL, disabled, check) { //MGC 03 - 10 - 2018 solicitud con orden de compra

    var r = addRowl(
        t,
        POS,
        "<input disabled  class=\"NumAnexo\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo + "\">",
        "<input disabled  class=\"NumAnexo2\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo2 + "\">",
        "<input disabled  class=\"NumAnexo3\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo3 + "\">",
        "<input disabled  class=\"NumAnexo4\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo4 + "\">",
        "<input disabled  class=\"NumAnexo5\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + NumAnexo5 + "\">",
        CA,//MGC 04092018 Conceptos
        "<input " + disabled + " class=\"FACTURA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + FACTURA + "\">",
        TIPO_CONCEPTO,
        "<input " + disabled + " class=\"GRUPO GRUPO_INPUT\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + GRUPO + "\">",
         CUENTA,//MGC 04092018 Conceptos
        CUENTANOM,
        TIPOIMP,
        IMPUTACION,
        "<input disabled class=\"CCOSTO\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + CCOSTO + "\">",
        "<input " + disabled + " class=\"MONTO OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + MONTO + "\">",
        "",
        "<input disabled class=\"IVA\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + IVA + "\">",
        "<input " + disabled + " class=\"\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + TEXTO + "\">",//Lej 13.09.2018
        TOTAL,
        check //MGC 03-10-2018 solicitud con orden de compra
    );

    return r;
}

function addRowl(t, pos, nA, nA2, nA3, nA4, nA5, ca, factura, tipo_concepto, grupo, cuenta, cuentanom, tipoimp, imputacion, ccentro, monto, impuesto,
    iva, texto, total, check) {
    //Lej 13.09.2018---
    var colstoAdd = "";
    for (i = 0; i < extraCols; i++) {
        colstoAdd += '<td class=\"BaseImp' + tRet2[i] + '\"><input class=\"extrasC BaseImp' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>';
        colstoAdd += '<td class=\"ImpRet' + tRet2[i] + '\"><input class=\"extrasC2 ImpRet' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>';

    }
    colstoAdd += "<td><input disabled class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + total + "\"></td>"
        + "<td><p><label><input type=\"checkbox\" checked=\"" + check + "\" /><span></span></label></p></td>";//MGC 03 - 10 - 2018 solicitud con orden de compra
    var table_rows = '<tr><td></td><td>' + pos + '</td><td><input class=\"NumAnexo\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo2\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo3\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo4\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo5\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td>' +
        ca + '</td><td>' + factura + '</td><td>' + tipo_concepto
        + '</td><td>' + grupo + '</td><td>' + cuenta + '</td><td>' + cuentanom + '</td><td>' + tipoimp + '</td><td>' + imputacion
        + '</td><td>' + ccentro + '</td><td>' + monto + '</td><td>' + impuesto + '</td><td>' + iva + '</td><td>' + texto + '</td>' + colstoAdd + '</tr>';
    //Lej 13.09.2018--------------------------------
    if (extraCols === 0) {//Lej 13.09.2018
        var r = t.row.add([
            "",
            pos,
            nA,
            nA2,
            nA3,
            nA4,
            nA5,
            ca,
            factura,
            tipo_concepto,
            grupo,
            cuenta,
            cuentanom,
            tipoimp,
            imputacion,
            ccentro,
            monto,
            impuesto,
            iva,
            texto,
            "<input disabled class=\"TOTAL OPER\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"" + total + "\">",
            "<input class=\"CHECK\" style=\"font-size:12px;\" type=\"checkbox\" id=\"\" name=\"\" value=\"" + check + "\">" //MGC 03 - 10 - 2018 solicitud con orden de compra
        ]).draw(false).node();
    } else {
        var r = t.row.add(
            $(table_rows)//Lej 15.09.2018
        ).draw(false).node();
    }

    return r;
}

function resetTabs() {

    var ell = document.getElementById("tabs");
    var instances = M.Tabs.getInstance(ell);

    var active = $('.tabs').find('.active').attr('href');
    active = active.replace("#", "");
    instances.select(active);
    //instances.updateTabIndicator
}