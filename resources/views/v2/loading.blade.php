<!DOCTYPE html>
<html>
 <head>
   <title>Preview</title>
   <meta charset="utf-8">
 </head>
 <body>
    <style type="text/css">
        .spinner {
          width: 40px;
          height: 40px;

          position: relative;
          margin: 100px auto;
        }

          .double-bounce1, .double-bounce2 {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #333;
            opacity: 0.6;
            position: absolute;
            top: 0;
            left: 0;
            
            -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
            animation: sk-bounce 2.0s infinite ease-in-out;
          }

          .double-bounce2 {
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
          }

          @-webkit-keyframes sk-bounce {
            0%, 100% { -webkit-transform: scale(0.0) }
            50% { -webkit-transform: scale(1.0) }
          }

          @keyframes sk-bounce {
            0%, 100% { 
              transform: scale(0.0);
              -webkit-transform: scale(0.0);
            } 50% { 
              transform: scale(1.0);
              -webkit-transform: scale(1.0);
            }
          }
    </style>
  <div class="spinner">
  <div class="double-bounce1"></div>
  <div class="double-bounce2"></div>
</div>
 </body> 
</html>