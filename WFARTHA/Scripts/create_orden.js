$(document).ready(function () {
    $('#table_infoP').DataTable({

        language: {
            //"url": "../Scripts/lang/@Session["spras"].ToString()" + ".json"
            "url": "../Scripts/lang/ES.json"
        },
        "paging": false,
        "info": false,
        "searching": false,
        //"scrollX": true,
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
                "orderable": false
                //,"visible": false //MGC 04092018 Conceptos
            },
            {
                "name": 'NumAnexo',
                "className": 'NumAnexo',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'NumAnexo2',
                "className": 'NumAnexo2',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'NumAnexo3',
                "className": 'NumAnexo3',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'NumAnexo4',
                "className": 'NumAnexo4',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'NumAnexo5',
                "className": 'NumAnexo5',
                "orderable": false,
                "visible": false
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
                "orderable": false,
                "visible": false
            },
            {
                "name": 'TCONCEPTO',
                "className": 'TCONCEPTO',
                "orderable": false,
                "visible": false
            },
            {
                "name": 'GRUPO',
                "className": 'GRUPO',
                "orderable": false,
                "visible": false
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
                "orderable": false,
                "visible": false
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
                "orderable": false,
                "visible": false

            },
            {
                "name": 'MATNR',
                "className": 'MATNR',
                "orderable": false
            },
            {
                "name": 'TXTPOS',
                "className": 'TXTPOS',
                "orderable": false
            },
            {
                "name": 'MONTO',
                "className": 'MONTO',
                "orderable": false
            },
            {
                "name": 'MENGE',
                "className": 'MENGE',
                "orderable": false
            },
            {
                "name": 'MONTO_F',
                "className": 'MONTO_F',
                "orderable": false
            },
            {
                "name": 'MENGE_F',
                "className": 'MENGE_F',
                "orderable": false
            },
            {
                "name": 'MEINS',
                "className": 'MEINS',
                "orderable": false
            },
            {
                "name": 'ANT_SOL',
                "className": 'ANT_SOL',
                "orderable": false
            },
            {
                "name": 'ANT_PAG',
                "className": 'ANT_PAG',
                "orderable": false
            },
            {
                "name": 'ANT_AMO',
                "className": 'ANT_AMO',
                "orderable": false
            },
            {
                "name": 'IMPUESTO',
                "className": 'IMPUESTOP',
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
            },
            //MGC ADD 03-10-2018 solicitud con orden de compra
            {
                "name": 'CHECK',
                "className": 'CHECK',
                "orderable": false
            }
        ]
    });

    $('#table_infoP tbody').on('click', 'td.select_row', function () {
        $(tr).toggleClass('selected');
    });


    $('body').on('focusout', '.OPERP', function (e) {

        var t = $('#table_infop').DataTable();
        var tr = $(this).closest('tr'); //Obtener el row 

        //Obtener el valor del impuesto
        //var imp = tr.find("td.IMPUESTOP input").val();
        var imp = tr.find("td.IMPUESTOP").find("select").val();

        //Calcular impuesto y subtotal
        var impimp = impuestoVal(imp);
        impimp = parseFloat(impimp);

        //Desde el total
        if ($(this).hasClass("TOTAL")) {

            var total = $(this).val();
            total = parseFloat(total);

            var impv = (total * impimp) / 100;
            impv = parseFloat(impv);
            var sub = total - impv;

            impv = toShow(impv);
            sub = toShow(sub);
            total = toShow(total);

            //Enviar los valores a la tabla
            //Subtotal
            tr.find("td.MONTO_F input").val();
            tr.find("td.MONTO_F input").val(sub);

            //IVA
            tr.find("td.IVA input").val();
            tr.find("td.IVA input").val(impv);

            //Total
            tr.find("td.TOTAL input").val();
            tr.find("td.TOTAL input").val(total);


        }
        else if ($(this).hasClass("MONTO_F")) {

            //Desde el subtotal
            var sub = $(this).val().replace('$', '').replace(',', '');
            sub = parseFloat(sub);

            //Lleno los campos de Base Imponible con el valor del monto
            for (x = 0; x < tRet2.length; x++) {
                var _xvalue = tr.find("td.BaseImp" + tRet2[x] + " input").val();
                if (_xvalue == "") {
                    tr.find("td.BaseImp" + tRet2[x] + " input").val(toShow(sub));
                    //Ejecutamos un ajax para llenar el valor de importe de retencion
                    var _res = porcentajeImpRet(tRet2[x]);
                    _res = (sub * _res) / 100;//Saco el porcentaje
                    tr.find("td.ImpRet" + tRet2[x] + " input").val(toShow(_res));
                }
            }
            //Ejecutamos el metodo para sumarizar las columnas
            var colTotal = sumarColumnasExtras(tr);

            // rimpimp = 100 - impimp;

            var impv = (sub * impimp) / 100;
            impv = parseFloat(impv);
            var total = sub + impv;
            total = parseFloat(total);

            var sub = total - impv;

            impv = toShow(impv);
            sub = toShow(sub);
            total = toShow(total);

            //Enviar los valores a la tabla
            //Subtotal
            tr.find("td.MONTO_F input").val();
            tr.find("td.MONTO_F input").val(sub);

            //IVA
            tr.find("td.IVA input").val();
            tr.find("td.IVA input").val(impv);

            //Total
            tr.find("td.TOTAL input").val();
            if (colTotal > 0) {
                var sumt = parseFloat(total.replace('$', '').replace(',', '')) - parseFloat(colTotal);
                tr.find("td.TOTAL input").val(toShow(sumt));
            }
            else {
                tr.find("td.TOTAL input").val(total);
            }
        } else {
            $(this).val(toShowNum($(this).val()));
        }
        updateFooter();
        //$(".extrasC").trigger("focusout"); //lej18102018
    });

    $('body').on('change', '#PAYER_ID', function (event) {
        llenaOrdenes($(this).val());
    });
});

var pedidosSel = [];

$('body').on('keydown.autocomplete', '#norden_compra', function () {
    var tr = $(this).closest('tr'); //Obtener el row
    var t = $('#table_infoP').DataTable();

    //Obtener el id de la sociedad
    var prov = $("#PAYER_ID").val();
    var pedidosNum = [];
    //if (prov.trim() !== "") {
    //    pedidosNum = ["4000000001", "4000000002", "4000000003", "4000000004", "4000000005"];
    //}
    auto(this).autocomplete({
        source: function (request, response) {
            auto.ajax({
                type: "POST",
                url: 'getPedidos',
                dataType: "json",
                data: { "Prefix": request.term, lifnr: prov },
                success: function (data) {
                    response(auto.map(data, function (item) {
                        //return { label: trimStart('0', item.LIFNR) + " - " + item.NAME1, value: trimStart('0', item.LIFNR) };
                        return { label: trimStart('0', item.EBELN), value: trimStart('0', item.EBELN) };
                    }))
                }
            })
            //pedidosNum
        }
        ,
        messages: {
            noResults: '',
            results: function (resultsCount) { }
        },
        change: function (e, ui) {
            if (!(ui.item)) {
                e.target.value = "";
                t.rows().remove().draw(false);
            }
        },
        select: function (event, ui) {
            pedidosSel = [];
            var label = ui.item.label;
            var value = ui.item.value;
            //for (var i = 0; i < pedidos.length; i++) {
            //    if (pedidos[i].NUM_PED == value)
            //        pedidosSel.push(pedidos[i]);
            //}
            ////alert(pedidosSel);
            addPedido(value);
        }
    });
});

function llenaOrdenes(lifnr) {
    var tr = $(this).closest('tr'); //Obtener el row
    var t = $('#table_infoP').DataTable();

    //Obtener el id de la sociedad
    var prov = lifnr
    var pedidosNum = [];
    $("#norden_compra").empty();

    auto.ajax({
        type: "POST",
        url: 'getPedidos',
        dataType: "json",
        data: { "Prefix": "", lifnr: prov },
        success: function (data) {
            $("#norden_compra").append($("<option>").attr('value', "").text(""));
            for (var i = 0; i < data.length; i++) {
                var ebeln = data[i].EBELN
                $("#norden_compra").append($("<option>").attr('value', ebeln).text(ebeln));
            }

            var elem = document.querySelectorAll("select");
            var instance = M.Select.init(elem, []);
        }
    });
}


function mostrarTabla(ban) {
    if (ban == "False") {
        $("#div_sinPedido").addClass("hide");
        $("#div_conPedido").removeClass("hide");
        $("#div_garantia").removeClass("hide");
    } else {
        $("#div_conPedido").addClass("hide");
        $("#div_sinPedido").removeClass("hide");
        $("#div_garantia").addClass("hide");
    }
}

function addPedido(ebeln) {
    var t = $('#table_infoP').DataTable();
    var ti = $('#table_info').DataTable();

    t.rows().remove().draw(false);
    ti.rows().remove().draw(false);
    document.getElementById("loader").style.display = "initial";

    auto.ajax({
        type: "POST",
        url: 'getPedidosPos',
        dataType: "json",
        data: { ebeln: ebeln },
        success: function (data) {
            var P = data;

            var posinfo = 0;
            for (var i = 0; i < P.length; i++) {
                var addedRowInfo = addRowInfoP(t, P[i].EBELP, "", "", "", "", "", "D", "", "", "", "", "", "", "", "", P[i].MENGE, "", "", "", "", "", "", P[i]);//Lej 13.09.2018 //MGC 03-10-2018 solicitud con orden de compra
                posinfo = i + 1;

                //Obtener el select de impuestos en la cabecera
                var idselect = "infoSel" + posinfo;

                //Obtener el valor 
                var imp = $('#IMPUESTO').val();
                addSelectImpuestoP(addedRowInfo, imp, idselect, "", "X");

                updateFooterP();
            }
            document.getElementById("loader").style.display = "none";
        },
        error: function (x) {
            alert(x);
            document.getElementById("loader").style.display = "none";
        },
        sync: false
    });

    document.getElementById("loader").style.display = "initial";
    auto.ajax({
        type: "POST",
        url: 'getFondos',
        dataType: "json",
        data: { ebeln: ebeln },
        success: function (data) {
            $("#fondo_g").val(data.FONDOG);
            $("#Rfondo_g").val(data.RET_FONDOG);
            $("#Resfondo_g").val(data.RES_FONDOG);
            document.getElementById("loader").style.display = "none";
        },
        error: function (x) {
            alert(x);
            document.getElementById("loader").style.display = "none";
        },
        sync: false
    });

}


function addRowInfoP(t, POS, NumAnexo, NumAnexo2, NumAnexo3, NumAnexo4, NumAnexo5, CA, FACTURA,
    TIPO_CONCEPTO, GRUPO, CUENTA, CUENTANOM, TIPOIMP, IMPUTACION, CCOSTO, MONTO, IMPUESTO, IVA, TEXTO, TOTAL, disabled, check, PED) { //MGC 03 - 10 - 2018 solicitud con orden de compra

    var r = addRowlP(
        t,
        POS,
        "<input disabled  class='NumAnexo' style='font-size:12px;' type='text' id='' name='' value='" + NumAnexo + "'>",
        "<input disabled  class='NumAnexo2' style='font-size:12px;' type='text' id='' name='' value='" + NumAnexo2 + "'>",
        "<input disabled  class='NumAnexo3' style='font-size:12px;' type='text' id='' name='' value='" + NumAnexo3 + "'>",
        "<input disabled  class='NumAnexo4' style='font-size:12px;' type='text' id='' name='' value='" + NumAnexo4 + "'>",
        "<input disabled  class='NumAnexo5' style='font-size:12px;' type='text' id='' name='' value='" + NumAnexo5 + "'>",
        //"<input class='CA' style='font-size:12px;' type='text' id='' name='' value='" + CA + "'>",//MGC 04092018 Conceptos
        CA,//MGC 04092018 Conceptos
        "<input " + disabled + " class='FACTURA' style='font-size:12px;' type='text' id='' name='' value='" + FACTURA + "'>",
        TIPO_CONCEPTO,
        "<input " + disabled + " class='GRUPO GRUPO_INPUT' style='font-size:12px;' type='text' id='' name='' value='" + GRUPO + "'>",
        //"<input class='CUENTA' style='font-size:12px;' type='text' id='' name='' value='" + CUENTA + "'>",//MGC 04092018 Conceptos
        CUENTA,//MGC 04092018 Conceptos
        CUENTANOM,
        TIPOIMP,
        IMPUTACION,
        "<input disabled class='CCOSTO' style='font-size:12px;' type='text' id='' name='' value='" + CCOSTO + "'>",
        "<input " + disabled + " class='MONTO OPERP' style='font-size:12px;' type='text' id='' name='' value='" + MONTO + "'>",
        //"<div class='input-field'></div>",
        "",
        "<input disabled class='IVA' style='font-size:12px;' type='text' id='' name='' value='" + IVA + "'>",
        "<input " + disabled + " class='' style='font-size:12px;' type='text' id='' name='' value='" + TEXTO + "'>",//Lej 13.09.2018
        TOTAL,//"<input " + disabled + " class='TOTAL OPERP' style='font-size:12px;' type='text' id='' name='' value='" + TOTAL + "'>"
        check //MGC 03-10-2018 solicitud con orden de compra
        ,
        //PED
        PED.MATNR + "",//P.MATNR,//-------------------MATNR
        PED.TXZ0 + "",//P.TEXTO,//-------------------TEXTO
        "<input disabled class='' style='font-size:12px;' type='text' id='' name='' value='" + toShow(PED.NETWR) + "'>",//P.MENGE,//-------------------CANTIDAD
        "<input disabled class='' style='font-size:12px;' type='text' id='' name='' value='" + toShowNum(PED.MENGE) + "'>",//P.MEINS,//-------------------MEINS
        "<input class='MONTO_F OPERP' style='font-size:12px;' type='text' id='' name='' value='" + toShow(PED.NETWR - PED.H_VAL_LOCCUR) + "'>",//P.MEINS,//-------------------MEINS
        "<input class='OPERP' style='font-size:12px;' type='text' id='' name='' value='" + toShowNum(PED.MENGE - PED.H_QUANTITY) + "'>",//P.MEINS,//-------------------MEINS
        PED.MEINS,
        toShow(PED.H_ANT_SOL),
        toShow(PED.H_ANT_PAG),
        toShow(PED.H_ANT_AMORT)
    );

    return r;
}

function addRowlP(t, pos, nA, nA2, nA3, nA4, nA5, ca, factura, tipo_concepto, grupo, cuenta, cuentanom, tipoimp, imputacion, ccentro, monto, impuesto,
    iva, texto, total, check, matnr, textoP, montoP, cant, montoF, cantF, meins, sol, pag, ant) {//MGC 03-10-2018 solicitud con orden de compra
    //alert(extraCols);
    //Lej 13.09.2018---
    var colstoAdd = "";
    for (i = 0; i < extraCols; i++) {
        //if (i % 2 == 0) { 
        colstoAdd += '<td class=\"BaseImp' + tRet2[i] + '\"><input class=\"extrasC BaseImp' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>';
        colstoAdd += '<td class=\"ImpRet' + tRet2[i] + '\"><input class=\"extrasC2 ImpRet' + i + '\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td>';
        //}
        //else
        //{
        //}
    }
    colstoAdd += "<td><input disabled class='TOTAL OPERP' style='font-size:12px;' type='text' id='' name='' value='" + total + "'></td>"
        //+ "<td><input class='CHECK' style='font-size:12px;' type='checkbox' id='' name='' value='" + check + "'></td>" //MGC 03 - 10 - 2018 solicitud con orden de compra
        + "<td><p><label><input type='checkbox' checked='" + check + "' /><span></span></label></p></td>";//MGC 03 - 10 - 2018 solicitud con orden de compra
    var table_rows = '<tr><td></td><td>' + pos + '</td><td><input class=\"NumAnexo\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo2\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo3\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo4\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td><input class=\"NumAnexo5\" style=\"font-size:12px;\" type=\"text\" id=\"\" name=\"\" value=\"\"></td><td>' +
        ca + '</td><td>' + factura + '</td><td>' + tipo_concepto
        + '</td><td>' + grupo + '</td><td>' + cuenta + '</td><td>' + cuentanom + '</td><td>' + tipoimp + '</td><td>' + imputacion
        + '</td><td>' + ccentro + '</td><td>' + monto + '</td><td>' + impuesto + '</td><td>' + iva + '</td><td>' + texto + '</td>' + colstoAdd + '</tr>';
    //Lej 13.09.2018--------------------------------
    if (extraCols == 0) {//Lej 13.09.2018
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
            matnr,
            textoP,
            montoP,
            cant, montoF, cantF, meins, sol, pag, ant,
            impuesto,
            iva,
            //texto,
            "<input disabled class='TOTAL OPERP' style='font-size:12px;' type='text' id='' name='' value='" + total + "'>",
            "<input class='CHECK' style='font-size:12px;' type='checkbox' id='' name='' value='" + check + "'>" //MGC 03 - 10 - 2018 solicitud con orden de compra
        ]).draw(false).node();
    } else {
        var r = t.row.add(
            //[
            //"",
            //pos,
            //ca,
            //factura,
            //tipo_concepto,
            //grupo,
            //cuenta,
            //cuentanom,
            //tipoimp,
            //imputacion,
            //ccentro,
            //monto,
            //impuesto,
            //iva,
            //total,
            //texto
            // ]
            $(table_rows)//Lej 13.09.2018
        ).draw(false).node();
    }

    return r;
}

function updateFooterP() {
    resetFooter();

    var t = $('#table_infoP').DataTable();
    var total = 0;

    $("#table_infoP > tbody > tr[role = 'row']").each(function (index) {
        //var col11 = $(this).find("td.TOTAL input").val();
        var col11 = $(this).find("td.TOTAL input").val();

        //Saber si el renglón se va a sumar
        var tr = $(this);
        var indexopc = t.row(tr).index();

        //Obtener la accion
        var ac = t.row(indexopc).data()[2];



        col11 = col11.replace(/\s/g, '');
        var val = toNum(col11);
        val = convertI(val);
        if ($.isNumeric(val)) {
            if (ac != "H") {
                total += val;
            }
        }
    });

    total = total.toFixed(2);

    $('#total_info').text(toShow(total));
    $('#MONTO_DOC_MD').val(toShow(total));//Lej 18.09.2018
}

//MGC 04092018 Conceptos
function addSelectImpuestoP(addedRowInfo, imp, idselect, disabled, clase) {

    //Obtener la celda del row agregado
    var ar = $(addedRowInfo).find("td.IMPUESTOP");


    var sel = $("<select class = 'IMPUESTOP_SELECT browser-default' id = '" + idselect + "'> ").appendTo(ar);
    //var sel = $("<select class = 'IMPUESTOP_SELECT' id = '" + idselect + "'> ").appendTo(ar);
    $("#IMPUESTO option").each(function () {
        var _valor = $(this).val();//lej 19.09.2018
        var _texto = $(this).text();//lej 19.09.2018
        sel.append($("<option>").attr('value', _valor).text(_texto));//lej 19.09.2018
    });

    //Seleccionar el valor
    //$("#" + idselect + "").val(imp).change("sel");    
    // $("#" + idselect + "").val(imp).trigger("change", ["tr"]);
    $("#" + idselect + "").val(imp);
    $("#" + idselect + "").siblings(".select-dropdown").css("font-size", "12px");
    if (disabled == "X") {

        $("#" + idselect + "").prop('disabled', 'disabled');
    }

    //Iniciar el select agregado
    //var elem = document.getElementById(idselect);
    //var options = {
    //    dropdownOptions: {
    //        constrainWidth: false
    //        //,container: "div_selP"
    //    }
    //}
    //var instance = M.Select.init(elem, []);
    $(".IMPUESTOP_SELECT").trigger("change");
}

$('body').on('change', '.IMPUESTOP_SELECT', function (event, param1) {

    if (param1 != "tr") {
        //Modificación del sub, iva y total

        var t = $('#table_infop').DataTable();
        var tr = $(this).closest('tr'); //Obtener el row 

        //Obtener el valor del impuesto
        var imp = tr.find("td.IMPUESTOP").find("select").val();

        //Calcular impuesto y subtotal
        var impimp = impuestoVal(imp);
        impimp = parseFloat(impimp);
        var colTotal = sumarColumnasExtras(tr);//lej 19.08.18

        var sub = tr.find("td.MONTO_F input").val().replace('$', '').replace(',', '');
        sub = parseFloat(sub);

        //rimpimp = 100 - impimp;//lej 19.08.18

        var impv = (sub * impimp) / 100;
        impv = parseFloat(impv);
        var total = sub + impv;
        total = parseFloat(total);

        impv = toShow(impv);
        sub = toShow(sub);
        total = toShow(total);

        //Enviar los valores a la tabla
        //Subtotal
        tr.find("td.MONTO_F input").val();
        tr.find("td.MONTO_F input").val(sub);

        //IVA
        tr.find("td.IVA input").val();
        tr.find("td.IVA input").val(impv);

        //Total
        tr.find("td.TOTAL input").val();
        if (colTotal > 0) {
            var sumt = parseFloat(total.replace('$', '').replace(',', '')) + parseFloat(colTotal);
            tr.find("td.TOTAL input").val(toShow(sumt));
        }
        else {
            tr.find("td.TOTAL input").val(total);
        }
        updateFooterP();
    }

});