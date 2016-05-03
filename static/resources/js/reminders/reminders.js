$(document).ready(function() {

    var todo_table = $('#list-todo').DataTable({
    'ajax': {
        "type"   : "GET",
        "url"    : 'api/reminders',

        "dataSrc": ""
    },
        'columns': [
            {"data" : "fields.details"},
            {"mRender": function(data, type, row) {
                            return getFormattedDate(new Date(row.fields.due_date));
                        }
            },
            {
             "mRender": function (data, type, row) {
                            return '<button type="button" class="button alert tiny" id="remove-'+ row.pk +'">Done</td>';
                        }
            }
        ],

    });

    $('#revealModal').click(function(e) {

        $('#addModal').foundation('reveal', 'open');

    });


    $("#submitButton").click(function(event) {

        addNewReminder(todo_table);

    });


    $('#list-todo').on("click", 'button', function() {
        var id = this.id.split('remove-');
        removeReminders(id[1], todo_table);
    });


    $('#due').fdatepicker({
		format: 'mm/dd/yyyy',
		disableDblClickSelection: true
	});


});


function addNewReminder(todo_table) {

    url = '/api/add';

    /* Send the data using post */
    var posting = $.post( url, {
                      details : $('#details').val(),
                      due_date : $('#due').val(),
                      csrfmiddlewaretoken : getCookie('csrftoken')
    });

    /* Alerts the results */
    posting.done(function( data ) {
        if(data.success) {
            $('#addModal').foundation('reveal', 'close');
            todo_table.ajax.reload();
        }

    });

}

function removeReminders(id, todo_table) {

    $.ajax({
	    type: 'POST',
	    url: 'api/remove',
	    dataType: 'json',
	    data: { id: id,
	            csrfmiddlewaretoken : getCookie('csrftoken')
	            },
	    success: function (data) {
	        if(data.success) {
                todo_table.ajax.reload();
            }

	    }
	});

}

function getFormattedDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month + "/" + day + "/" + year;
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}