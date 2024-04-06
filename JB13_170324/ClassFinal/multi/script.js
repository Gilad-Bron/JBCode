document.write("<table border=1>"); // תכתוב בבודי את הפקודה בין הגרשיים

for (var row = 1; row <= 10; row++) {
    document.write("<tr>"); // מתחיל שורת לוח כפל
    for (var col = 1; col <= 10; col++) {
        document.write("<td>" + row*col + "</td>");
    }
    document.write("</tr>"); // מסיים שורת לוח כפל
}

document.write("</table>");