export function srovnani(data): {} {
    let dd = {};
    let tab = {
            style: 'tableSrovnani',
            table: {
                headerRows: 1,
                body: [
                    [{text: 'Header 1', style: 'tableHeader'}, {text: 'Header 2', style: 'tableHeader'}, {text: 'Header 3', style: 'tableHeader'}]
                ]
            },
            layout: {
                fillColor: function (i, node) {
                    return (i % 2 === 0) ? '#CCCCCC' : null;
                }
            }
    };
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
        },
        tableSrovnani: {
            margin: [0, 35, 0, 15]
        },
        tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
        }
    };

    data.forEach( (x) => {
        tab.table.body.push([x.pojistovna, x.produkt, x.rocni + ' Kč']);
    });

    dd = {
        content : [tab],
        styles : styles
    };

    return dd;
}
