
/* ==================================================================== */
/*  TodoApp - A simple todo app built with HTML5 and javascript.        */
/*  Version 0.1                                                         */
/*  By Filip Stefansson                                                 */
/* ==================================================================== */



/* -- User experience ------------------------------------------------- */

$('li').live('mouseenter mouseleave', function (event) {
    if (event.type == 'mouseenter') {
        $(this).find('span.move').stop(true, true).fadeIn(500);
        $(this).find('span.delete').stop(true, true).delay(50).fadeIn(500);
    } else {
        $(this).find('span.move').stop(true, true).fadeOut(500);
        $(this).find('span.delete').stop(true, true).delay(50).fadeOut(500);
    }
});

$('article .todo-inner').live('mouseenter mouseleave', function (event) {
    if (event.type == 'mouseenter') {
        $(this).find('nav').stop(true, true).fadeIn(300);
    } else {
        $(this).find('nav').stop(true, true).fadeOut(300);
    }
});

// On enter
$('h3, span[contenteditable=true]').live('keydown', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
});

$('h3, span[contenteditable=true]').live('keyup', function (e) {
    if (e.keyCode == 13) {
        $('h3, span[contenteditable=true]').blur();
        $(this).parent('nav').parent('div').parent('article').find('input[type=text]').focus();
    }
});

$('span[contenteditable=true]').live('keyup', function (e) {
    if (e.keyCode == 13) {
        $('span[contenteditable=true]').blur();
        $(this).parent('li').next('li').find('span[contenteditable=true]').focus();
    }
});



/* -- Useful functions ------------------------------------------------- */

function reset() {
    localStorage.clear('todos');
    alert('Local Storage Reset: Done!')
}


function refresh() {
    $("ul").sortable({
        connectWith: 'ul',
        handle: 'span.move'
    });

    /* Move the whole lists around. */
    $("#todo-lists").sortable({
        handle: 'nav span.move'
    });
}



/* -- Init ------------------------------------------------------------- */

/* Find todos, if none: create. */
if (localStorage.getItem("todos")) {
    var todos = new Array();
    todos.lists = JSON.parse(localStorage.getItem("todos"));
} else {
    var todos = new Array();
    todos.lists = [{
        title: 'Click me to edit',
        todos: [{
            text: 'Add your first todo',
            status: 'checked'
        }, {
            text: 'Get things done.',
            status: false
        }]
    }]
}

/* Print todos on screen */

$.each(todos.lists, function (key, value) {
    $('#todo-lists').append('<article id="list-' + key + '"><div class="todo-inner"><h3 contenteditable="true">' + value.title + '</h3><nav><span class="delete">x</span><span class="move">+</span></nav><ul></ul><input type="text" class="add-todo" placeholder="Type and hit enter..." /></div></article>');

    $.each(todos.lists[key].todos, function (i, val) {
        if (val.status) {
            var checked = 'checked';
        } else {
            var checked = '';
        }
        $('#list-' + key + ' ul').append('<li><input type="checkbox" class="todo-' + i + '" ' + checked + ' /> <span contenteditable="true" class="content ' + checked + '">' + val.text + '</span><span class="move">+</span><span class="delete">x</span></li>');
    })
});

refresh();



/* -- New list --------------------------------------------------------- */

$('.new-list').live('click', function (event) {
    event.preventDefault();
    var position = todos.lists.length;
    todos.lists.push(position);

    var listNames = ['Start a revolution', 'Find a girlfriend', 'Buy groceries', 'Travel the world'];
    var listItems = ['Read a book about Che Guevara', 'Get a haircut', 'Toilet paper', 'Buy a map']
    var rand = Math.floor(Math.random() * 4)

    todos.lists[position] = {
        title: listNames[rand],
        todos: [{
            text: listItems[rand],
            status: false
        }]
    }

    $('#todo-lists').append('<article id="list-' + position + '"><div class="todo-inner"><h3 contenteditable="true">' + listNames[rand] + '</h3><nav><span class="delete">x</span><span class="move">+</span></nav><ul class="ui-sortable"><li><input type="checkbox" class="todo-0" /><span contenteditable="true" class="content">' + listItems[rand] + '</span><span class="move">+</span><span class="delete">x</span></li></ul><input type="text" class="add-todo" placeholder="Type and hit enter..." /></div></article>');

    refresh();

    localStorage.setItem("todos", JSON.stringify(todos.lists));

    $('#list-' + position).find('h3').focus();

});



/* -- New todo --------------------------------------------------------- */

$('.add-todo').live('keyup', function (e) {
    if (e.keyCode == 13) {
        var listID = $(this).parent('div').parent('article').attr('id').replace('list-', '');
        var position = todos.lists[listID].todos.length;
        var value = $(this).val();

        todos.lists[listID].todos.push(position);

        todos.lists[listID].todos[position] = {
            text: value,
            status: false
        }
        localStorage.setItem("todos", JSON.stringify(todos.lists));

        $(this).parent('div').find('ul').append('<li><input type="checkbox" class="todo-' + position + '"/><span contenteditable="true">' + value + '</span><span class="move">+</span><span class="delete">x</span></li>');
        $(this).val('');
    }
});



/* -- New positon(list) ------------------------------------------------ */

$('#todo-lists').live("sortstop", function (event, ui) {
    if (event.target.nodeName == 'DIV') {
        var newPosition = ui.item.index();
        var oldPosition = ui.item.attr('id').replace('list-', '');


        var theList = todos.lists.slice(oldPosition);
        todos.lists.splice(oldPosition, 1);
        todos.lists.splice(newPosition, 0, theList[0])
        localStorage.setItem("todos", JSON.stringify(todos.lists));

        var i = 0;
        $('#todo-lists article').each(function () {
            $(this).attr('id', 'list-' + i);
            i++;
        });
    }
});



/* -- New positon(todo) ------------------------------------------------ */


$('ul').live("sortstop", function (event, ui) {
    if (event.target.nodeName == 'UL') {
        var oldPos = ui.item.find('input').attr('class').replace('todo-', '');
        var newPos = ui.item.index();
        var theList = ui.item.parent('ul').parent('div').parent('article').attr('id').replace('list-', '');

        var theTodo = todos.lists[theList].todos.slice(oldPos);
        todos.lists[theList].todos.splice(oldPos, 1);
        todos.lists[theList].todos.splice(newPos, 0, theTodo[0])
        localStorage.setItem("todos", JSON.stringify(todos.lists));

        var i = 0;
        $('#list-' + theList + ' ul li input').each(function () {
            $(this).attr('class', 'todo-' + i);
            i++;
        });
    }
});

$('ul').live("sortreceive", function (event, ui) {
    if (event.target.nodeName == 'UL') {
        var oldPos = ui.item.find('input').attr('class').replace('todo-', '');
        var oldList = ui.sender.parent('div').parent('article').attr('id').replace('list-', '');

        var newList = ui.item.parent('ul').parent('div').parent('article').attr('id').replace('list-', '');
        var newPos = ui.item.index();

        var theTodo = todos.lists[oldList].todos.slice(oldPos);
        todos.lists[oldList].todos.splice(oldPos, 1);
        todos.lists[newList].todos.splice(newPos, 0, theTodo[0])
        localStorage.setItem("todos", JSON.stringify(todos.lists));

        var i = 0;
        $('#list-' + newList + ' div ul li input').each(function () {
            $(this).attr('class', 'todo-' + i);
            i++;
        });
        var index = 0;
        $('#list-' + oldList + ' div ul li input').each(function () {
            $(this).attr('class', 'todo-' + index);
            index++;
        });
    }
})



/* -- On check --------------------------------------------------------- */

$('input[type=checkbox]').live('click', function () {
    var listID = $(this).parent('li').parent('ul').parent('div').parent('article').attr('id').replace('list-', '');
    var todoID = $(this).attr('class').replace('todo-', '');
    if (todos.lists[listID].todos[todoID].status == false) {
        todos.lists[listID].todos[todoID].status = 'checked';
        $('#list-' + listID + ' li input.todo-' + todoID).parent('li').find('span').addClass('checked');
    } else {
        todos.lists[listID].todos[todoID].status = false;
        $('#list-' + listID + ' li input.todo-' + todoID).parent('li').find('span').removeClass('checked');

    }

    localStorage.setItem("todos", JSON.stringify(todos.lists));

})

/* -- On update(todo) -------------------------------------------------- */

$("span[contenteditable=true]").live('blur', function () {
    var listID = $(this).parent('li').parent('ul').parent('div').parent('article').attr('id').replace('list-', '');
    var todoID = $(this).parent('li').find('input').attr('class').replace('todo-', '');

    todos.lists[listID].todos[todoID].text = $(this).html();

    localStorage.setItem("todos", JSON.stringify(todos.lists));
})




/* -- On update(title) ------------------------------------------------- */

$("article div h3").live('blur', function () {
    var listID = $(this).parent('div').parent('article').attr('id').replace('list-', '');

    todos.lists[listID].title = $(this).html();

    localStorage.setItem("todos", JSON.stringify(todos.lists));
})



/* -- On delete(list) -------------------------------------------------- */

$('nav .delete').live('click', function () {
    var listID = $(this).parent('nav').parent('div').parent('article').attr('id').replace('list-', '');

    todos.lists.splice(listID, 1);

    if (todos.lists.length == 0) {
        localStorage.clear('todos');
    } else {
        localStorage.setItem("todos", JSON.stringify(todos.lists));
    }

    $(this).parent('nav').parent('div').parent('article').fadeOut(200, function (index) {
        $(this).remove();

        $('article').each(function () {
            var currentID = $(this).attr('id').replace('list-', '');
            if (currentID > listID) {
                var newID = currentID - 1;

                $(this).attr('id', 'list-' + newID);
            }
        });
    });

})



/* -- On delete(todo) -------------------------------------------------- */


$('li .delete').live('click', function () {
    var todoID = $(this).parent('li').find('input').attr('class').replace('todo-', '');
    var listID = $(this).parent('li').parent('ul').parent('div').parent('article').attr('id').replace('list-', '');

    todos.lists[listID].todos.splice(todoID, 1);

    localStorage.setItem("todos", JSON.stringify(todos.lists));

    $(this).parent('li').fadeOut(200, function (index) {
        $(this).remove();

        $('#list-' + listID + ' div ul li').each(function () {
            var currentID = $(this).find('input').attr('class').replace('todo-', '');
            if (currentID > todoID) {
                var newID = currentID - 1;

                $(this).find('input').attr('class', 'todo-' + newID);
            }
        });
    });
})