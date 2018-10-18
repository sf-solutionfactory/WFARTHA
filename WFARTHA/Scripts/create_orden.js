var pedidos = [
    { NUM_PED: "4000000001", POS: 1, LIFNR: "2000015", MONTO: 1000 },
    { NUM_PED: "4000000001", POS: 2, LIFNR: "2000015", MONTO: 578 },
    { NUM_PED: "4000000002", POS: 1, LIFNR: "2000000   ", MONTO: 78 },
    { NUM_PED: "4000000002", POS: 2, LIFNR: "2000000   ", MONTO: 35 },
    { NUM_PED: "4000000002", POS: 3, LIFNR: "2000000   ", MONTO: 879 },
    { NUM_PED: "4000000003", POS: 1, LIFNR: "100008    ", MONTO: 1000 },
    { NUM_PED: "4000000004", POS: 1, LIFNR: "100008    ", MONTO: 76 },
    { NUM_PED: "4000000004", POS: 2, LIFNR: "100008    ", MONTO: 456 },
    { NUM_PED: "4000000005", POS: 1, LIFNR: "100008    ", MONTO: 10000 }
];
var pedidosSel = [];

$('body').on('keydown.autocomplete', '#norden_compra', function () {
    var tr = $(this).closest('tr'); //Obtener el row

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


function addPedido(ebeln) {
    var t = $('#table_info').DataTable();

    t.rows().remove().draw(false);

    auto.ajax({
        type: "POST",
        url: 'getPedidosPos',
        dataType: "json",
        data: { ebeln: ebeln },
        success: function (data) {
            var P = data;

            var posinfo = 0;
            for (var i = 0; i < P.length; i++) {
                var addedRowInfo = addRowInfo(t, "1", "", "", "", "", "", "D", "", "", "", "", "", "", "", "", P[i].MENGE, "", "", "", "", "", "");//Lej 13.09.2018 //MGC 03-10-2018 solicitud con orden de compra
                posinfo = i + 1;

                //Obtener el select de impuestos en la cabecera
                var idselect = "infoSel" + posinfo;

                //Obtener el valor 
                var imp = $('#IMPUESTO').val();
                addSelectImpuesto(addedRowInfo, imp, idselect, "", "X");
                
                updateFooter();
            }
        },
        error: function (x) {
            alert(x);
        },
        sync: false
    });

}