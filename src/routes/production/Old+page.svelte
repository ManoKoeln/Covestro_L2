<!-- <script lang="ts">

    import Header from "$lib/+header.svelte";
    import Footer from "$lib/+footer.svelte";
    </script> -->
<script>
    let grid = [
        [{ value: 1 }, { value: 2 }, { value: 3 }],
        [{ value: 4 }, { value: 5 }, { value: 6 }],
        [{ value: 7 }, { value: 8 }, { value: 9 }]
    ];

    let highlightValue = 5;
    let highlightedCells = [
        { row: 0, col: 1 },
        { row: 2, col: 2 }
    ];
</script>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
    }

    .cell {
        width: 50px;
        height: 50px;
        border: 1px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cell.highlight {
        border: 1px solid black;
    }

    .cell.blue {
        background-color: blue;
    }
</style>

<div class="grid">
    {#each grid as row, rowIndex}
        {#each row as cell, colIndex}
            <div
                class="cell {cell.value === highlightValue ? 'blue' : ''} {highlightedCells.find(c => c.row === rowIndex && c.col === colIndex) ? 'highlight' : ''}"
            >
                {cell.value}
            </div>
        {/each}
    {/each}
</div>