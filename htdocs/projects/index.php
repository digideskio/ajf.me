<!doctype html>
<meta charset=utf-8>
<title>Andrea's projects</title>
<link rel=stylesheet href=../style.css>

<main>
    <h1>Stuff I've made</h1>

    <p><a href=/>I</a> make way, way too many things. Here's a list of some of them. This page is dynamically generated from <a href=projects.json>this JSON file</a>, if you're curious.</p>

    <?php

    $data = file_get_contents('projects.json') or die("Error: couldn't open projects.json");
    $data = json_decode($data) or die("Error: couldn't decode JSON data");

    ?>
    <table>
        <thead>
            <tr>
                <?php foreach ($data->columns as $column): ?>
                    <th><?=htmlspecialchars($column->name)?></th>
                <?php endforeach; ?>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data->projects as $project): ?>
                <tr>
                    <?php foreach ($data->columns as $column): ?>
                        <?php if (!isset($project->{$column->id})): ?>
                            <td></td>
                        <?php elseif ($column->id === 'dead'): ?> 
                            <td><?=$project->dead ? "Yep" : "Not yet"?></td>
                        <?php elseif ($column->id === 'url' || $column->id === 'git'): ?>
                            <td><a href="<?=htmlspecialchars($project->{$column->id})?>">Link</a></td>
                        <?php else: ?>
                            <td><?=htmlspecialchars($project->{$column->id})?></td>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</main>
