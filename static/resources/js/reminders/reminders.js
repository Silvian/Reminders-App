$(document).ready(function() {

    loadReminders();


    $('#revealModal').click(function(e) {

        $('#addModal').foundation('reveal', 'open');

    });


    $("#submitButton").click(function(event) {

        addNewReminder();

    });


    $(document).on("click", '[id^="remove-"]', function(){
        var id = $('[id^="remove-"]').attr('id');
        var id = id.split('remove-');
        removeReminders(id[1]);
    });


    $('#due').fdatepicker({
		format: 'mm/dd/yyyy',
		disableDblClickSelection: true
	});


});


function loadReminders() {
    $('#reminders-empty').hide();
    $('#list-todo tbody').html("");

    $.ajax({
	    type: 'GET',
	    url: 'api/reminders',
	    dataType: 'json',
	    data: { get_param: 'value' },
	    success: function (data) {
	        if(data && data.length > 0) {
                $('#list-todo tbody').html("");

                $.each(data, function(i, item) {
                    var reminders = item.fields;
                    var due_date = getFormattedDate(new Date(reminders.due_date));
                    $('#list-todo tbody').append('<tr>' +
                        '<td>' + reminders.details + '</td>' +
                        '<td>' + due_date + '</td>' +
                        '<td><button type="button" class="button alert tiny" id="remove-'+ item.pk +'">Done</td>' +
                        '</tr>');
                });

            }

            else {
                $('#reminders-empty').show();
            }

	    }
	});

}

function addNewReminder() {

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
            loadReminders();
        }

    });

}

function removeReminders(id) {

    $.ajax({
	    type: 'POST',
	    url: 'api/remove',
	    dataType: 'json',
	    data: { id: id,
	            csrfmiddlewaretoken : getCookie('csrftoken')
	            },
	    success: function (data) {
	        if(data.success) {
                loadReminders();
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