function template({subtitle, body, sendersName, sendersEmail}) { 
    return (`
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>White Raven - Email</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style> 
            @import url("https://use.typekit.net/bqw1oao.css");
        </style>
        </head>
        <body bgcolor="#016AA3" style="margin: 0; padding: 0;background-image: linear-gradient(#6698CC 125px, #016AA3 130px);background-repeat: repeat-x;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600px">
        <tr>
            <td align="left" style="width:192px;height:70px;padding-top: 40px;padding-bottom:20px;padding-left:50px; background-image: radial-gradient(25% 50% at bottom center, #C69838 20%, rgba(198, 153, 56, 0.418) 50%, rgba(102,152,204,0.0));background-repeat: no-repeat;">
                <a href="https://white-raven.co.uk">
                    <img src="https://white-raven.co.uk/logo.png" alt="White Raven" width="192" height="70" style="display: block;" />
                </a>
            </td>
        </tr>
        <tr>
            <td style="padding-top:32px;padding-left:40px; padding-right:40px; background-image: radial-gradient(15% 100% at top center, #C69838, rgba(102,152,204,0.0));background-repeat: no-repeat;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
            ${ subtitle ? `
            <tr>
                <td align="right" style="padding-top: 0px;padding-bottom: 8px;padding-left:40px; padding-right:40px;color:#ffffff;font-family: nazare, Tahoma, sans-serif;font-weight: 600;font-style: normal;font-size:1.2em;letter-spacing: 4px;">
                ${subtitle}
                </td>
            </tr>
            ` : ''}
            ${ body ? `
            <tr>
                <td align="right" style="padding-top: 8px;padding-bottom: 8px;padding-left:40px; padding-right:40px;color:#E1E1E1;font-family: delve-hand, Georgia, sans-serif;font-weight: 400;font-style: normal;font-size:0.8em;">
                ${body}
                </td>
            </tr>
            ` : ''}
            ${ sendersName || sendersEmail ? `
                <tr>
                    <td align="right" style="padding-top: 8px;padding-bottom: 8px;padding-left:40px; padding-right:40px;color:#E1E1E1;font-family: delve-hand, Georgia, sans-serif;font-weight: 400;font-style: normal;font-size:0.8em;">
                        ${sendersName ? `${sendersName}<br />` : ''}
                        ${sendersEmail ? `${sendersEmail}<br />` : ''}
                    </td>
                </tr>
            ` : ''}
            
            <tr>
                    <td align="right" style="padding-top: 150px;padding-bottom:32px;padding-left:40px; padding-right:40px;">
                        <a style="color:#E1E1E1;text-decoration:none;font-family: banshee-std, cursive, Comic Sans MS, sans-serif;font-weight: 400;font-style: normal;font-size:1.2em;" href="https://white-raven.co.uk">
                                White-Raven.co.uk
                        </a>
                    </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
        </body>
        </html>
    `)
}

exports.template = template