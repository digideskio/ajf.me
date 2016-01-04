<!doctype html>
<meta charset=utf-8>
<title>Andrea's projects</title>
<link rel=stylesheet href=../style.css>
<style>
.col-name {
    max-width: 150px;
}
</style>

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
                    <th class=col-<?=$column->id?>><?=htmlspecialchars($column->name)?></th>
                <?php endforeach; ?>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data->projects as $project): ?>
                <tr>
                    <?php foreach ($data->columns as $column): ?>
                        <td class=col-<?=$column->id?>>
                            <?php if (!isset($project->{$column->id})): ?>
                                <?php /* this space left intentionally blank */ ?>
                            <?php elseif ($column->id === 'dead'): ?>
                                <?=$project->dead ? "Yep" : "Not yet"?>
                            <?php elseif ($column->id === 'url' || $column->id === 'git'): ?>
                                <a href="<?=htmlspecialchars($project->{$column->id})?>">Link</a>
                            <?php else: ?>
                                <?=htmlspecialchars($project->{$column->id})?>
                            <?php endif; ?>
                        </td>
                    <?php endforeach; ?>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</main>
