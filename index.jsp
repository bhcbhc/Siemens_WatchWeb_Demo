    <%@page contentType="text/html" pageEncoding="UTF-8"%>

        <%@page
                import="java.util.Properties,com.sitraffic.utcaas.watchweb.DeployableConfigInitializer,java.io.IOException"%>

        <!DOCTYPE html>
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="renderer" content="webkit | ie-comp | ie-stand" />
        <meta name="author" content="bhcbhc" />

        <title>Siemens_TMS</title>

            <!-- CSS for bootstrap-->
            <link rel="stylesheet" type="text/css" href="src/libs/bootstrap-3.3.7/css/bootstrap.min.css"/>
            <link rel="stylesheet" type="text/css" href="src/libs/bootstrap-3.3.7/css/bootstrap-theme.min.css"/>

            <!--CSS for Openlayers-->
            <link rel="stylesheet" type="text/css" href="src/libs/openlayersv-4.1.1/ol.css"/>

            <!--normalize-->
            <link rel="stylesheet" type="text/css" href="src/styles/normalize.css"/>
            <link rel="stylesheet" type="text/css" href="src/styles/app.css"/>

        </head>
        <body>
            <script src="src/libs/jquery/jquery-3.2.1.min.js"></script>
            <script src="src/libs/bootstrap-3.3.7/js/bootstrap.min.js"></script>
            <script src="src/libs/openlayersv-4.1.1/ol.js"></script>
            <script data-bind="app.js" src="src/libs/require/r.js"></script>
        </body>
        </html>