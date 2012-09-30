<?php

$html = <<< EOT
<!doctype html>
<meta charset=utf-8>
<meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel=stylesheet href=style.css>
<title>Todo</title>

<noscript>Sorry, JS required.</noscript>
<script src=script.js></script>
EOT;

const FILENAME = 'items.json';

if (file_exists(FILENAME)) {
    $data = json_decode(file_get_contents(FILENAME));
} else {
    $data = new StdClass();
    $data->items = [];
    file_put_contents(FILENAME, json_encode($data));
}

switch (isset($_REQUEST['p']) ? $_REQUEST['p'] : null) {
    case 'list':
        header('Content-Type: application/json');
        echo json_encode($data);
    break;
    case 'change_state':
        $name = $_POST['name'];
        $newState = ($_POST['state'] == 'true' ? TRUE : FALSE);
        $changes = 0;
        foreach ($data->items as $item) {
            if ($item->name == $name) {
                $item->state = $newState;
                $changes++;
            }
        }
        file_put_contents(FILENAME, json_encode($data));
        header('Content-Type: application/json');
        echo json_encode([
            'num_changed' => $changes,
            'result' => $data
        ]);
    break;
    case 'del_item':
        $name = $_POST['name'];
        $changes = 0;
        $data->items = array_values(array_filter($data->items, function ($item) use ($name, &$changes) {
            if ($item->name == $name) {
                $changes++;
                return FALSE;
            }
            return TRUE;
        }));
        /*foreach ($data->items as $key => $item) {
            if ($item->name == $name) {
                error_log($key);
                unset($data->items[$key]);
                $changes++;
            }
        }*/
        file_put_contents(FILENAME, json_encode($data));
        header('Content-Type: application/json');
        echo json_encode([
            'num_changed' => $changes,
            'result' => $data
        ]);
    break;
    case 'add_item':
        $name = $_POST['name'];
        $data->items[] = [
            'name' => $name,
            'state' => false
        ];
        file_put_contents(FILENAME, json_encode($data));
        header('Content-Type: application/json');
        echo json_encode([
            'result' => $data
        ]);
    break;
    default:
        header('Content-Type: text/html; charset=utf-8');
        echo $html;
    break;
}
