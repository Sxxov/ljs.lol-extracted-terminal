<script>
	import hull from 'hull.js';
import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { WindowUtility } from '../../resources/utilities';
	import CollageColour from './collage/CollageColour.svelte';
	import CollageImage from './collage/CollageImage.svelte';
	import CollageText from './collage/CollageText.svelte';

	const { innerWritable } = WindowUtility;

	window.addEventListener('resize', render);
	window.addEventListener('resize', updateComponentDomContentBoundingClientRectWritable);

	onMount(() => {
		updateComponentDomContentBoundingClientRectWritable();
	});

	onDestroy(() => {
		window.removeEventListener('resize', render);
		window.removeEventListener('resize', updateComponentDomContentBoundingClientRectWritable);
	});

	export let isImageExcluded = false;
	export let minimumColumns = 0;

	let columnsNumber = null;
	let rowsNumber = null;
	let currentRenderedColumnsNumber = null;
	let currentRenderedRowsNumber = null;
	let componentDomContent = null;
	const componentDomContentBoundingClientRectWritable = writable({});
	/** @typedef {[number, number]} coordinate */
	/** @type coordinate */
	let randomCoordinateMatrix = null;
	/** @type coordinate[][] */
	let randomCoordinateMatrixIndexes = null;
	/** @type string[] */
	let gridCSS = [];
	/** @type string[] */
	const clipPathCSS = [];
	/** @type string[] */
	const zIndexCSS = [];

	$: (
		columnsNumber = Math.max(
			Math.floor(
				$componentDomContentBoundingClientRectWritable.width / 150,
			),
			minimumColumns,
		)
	), render();
	$: (
		rowsNumber = Math.floor(
			$innerWritable.height / 150,
		)
	), render();

	render();

	/** @type {(CollageImage|CollageColour|CollageText)[]} */
	const COLLAGE_MATERIALS = isImageExcluded
		? [
			CollageColour,
			CollageText,
		] : [
			CollageImage,
			CollageImage,
			CollageColour,
			CollageText,
		];

	function updateComponentDomContentBoundingClientRectWritable() {
		componentDomContentBoundingClientRectWritable.set(componentDomContent?.getBoundingClientRect());
	}

	function getIncreasinglyDitheredArray(array) {
		const result = [];

		for (let i = 0, l = array.length; i < l; ++i) {
			if (Math.random() > i / l) {
				result[i] = array[i];
			}
		}

		return result;
	}

	function getRandomCollageMaterial() {
		return COLLAGE_MATERIALS[Math.floor(Math.random() * (COLLAGE_MATERIALS.length))];
	}

	/**
	 * @returns {{
	 * 		matrix: typeof randomCoordinateMatrix,
	 * 		matrixIndexes: typeof randomCoordinateMatrixIndexes,
	 * }}
	 * */
	function getRandomCoordinateMatrix(matrixColumnsNumber, matrixRowsNumber) {
		const matrix = [];
		const matrixIndexes = [];

		if (!matrixColumnsNumber
			|| !matrixRowsNumber) {
			return {
				matrix: null,
				matrixIndexes: null,
			};
		}

		let blockIndex = 0;
		for (let yIndex = 0, yLength = matrixRowsNumber; yIndex < yLength; ++yIndex) {
			for (let xIndex = 0, xLength = matrixColumnsNumber; xIndex < xLength; ++xIndex) {
				if (matrix[yIndex] === undefined) {
					matrix[yIndex] = [];
				} else if (matrix[yIndex][xIndex] !== undefined) {
					continue;
				}

				// get index and then increment
				const currentBlockIndex = blockIndex++;

				// make the first move on the current block
				matrix[yIndex][xIndex] = currentBlockIndex;
				matrixIndexes[currentBlockIndex] = [[xIndex, yIndex]];

				let yIndexMove = yIndex;
				let xIndexMove = xIndex;

				const move = () => {
					const isGoingToMove = Math.random() > 0.1;

					if (!isGoingToMove) {
						return;
					}

					const direction = Math.floor(Math.random() * 4);

					switch (direction) {
					// top
						case 0:
							--xIndexMove;
							break;
							// right
						case 1:
							++yIndexMove;
							break;
							// down
						case 2:
							++xIndexMove;
							break;
							// left
						case 3:
							--yIndexMove;
							break;
						default:
					}

					if (xIndexMove < 0
					|| xIndexMove >= xLength
					|| yIndexMove < 0
					|| yIndexMove >= yLength) {
						return;
					}

					if (matrix[yIndexMove] === undefined) {
						matrix[yIndexMove] = [];
					}

					const target = matrix[yIndexMove][xIndexMove];

					if (target !== undefined) {
						return;
					}

					matrix[yIndexMove][xIndexMove] = currentBlockIndex;
					matrixIndexes[currentBlockIndex].push([xIndexMove, yIndexMove]);

					move();
				};

				move();
			}
		}

		return {
			matrix,
			matrixIndexes,
		};
	}

	/**
	 * @param {coordinate[]} coordinates
	 * */
	function getMaximumAndMinimumCoordinate(coordinates) {
		const result = {
			x: {
				maximum: null,
				minimum: null,
			},
			y: {
				maximum: null,
				minimum: null,
			},
		};

		coordinates.forEach(([x, y]) => {
			if (result.x.maximum == null || x > result.x.maximum) {
				result.x.maximum = x;
			}
			if (result.x.minimum == null || x < result.x.minimum) {
				result.x.minimum = x;
			}
			if (result.y.maximum == null || y > result.y.maximum) {
				result.y.maximum = y;
			}
			if (result.y.minimum == null || y < result.y.minimum) {
				result.y.minimum = y;
			}
		});

		return result;
	}

	/** @param {number} number */
	function fromDecimalToPercent(number) {
		return `${number * 100}%`;
	}

	/** @param {string} string */
	function fromPercentToDecimal(string) {
		return Number(string.substr(0, string.length - 1)) / 100;
	}

	function getOffsetsFromDirection(direction) {
		const offsets = {
			x: 0,
			y: 0,
		};

		switch (direction) {
			case 0:
				offsets.y = -1;
				break;
			case 1:
				offsets.x = 1;
				break;
			case 2:
				offsets.y = 1;
				break;
			case 3:
				offsets.x = -1;
				break;
			default:
				throw new Error(`Unrecognized direction to get offsets from — ${direction}`);
		}

		return offsets;
	}

	function getInvertedDirection(direction) {
		switch (direction) {
			case 0:
				return 2;
			case 1:
				return 3;
			case 2:
				return 0;
			case 3:
				return 1;
			default:
				throw new Error(`Unrecognized direction to invert — ${direction}`);
		}
	}

	/** @param {[number, number][]} polygonVerticies */
	function getNearestVertexInDirection(direction, startingVertex, polygonVerticies) {
		const offsets = getOffsetsFromDirection(direction);
		const xOrY = Math.abs(offsets.y);
		const isNextInsteadOfBefore = xOrY === 0 ? offsets.x > 0 : offsets.y > 0;

		const validVerticies = polygonVerticies
			.filter((vertex) => (
				vertex[Number(!xOrY)] === startingVertex[Number(!xOrY)]
				&& (
					isNextInsteadOfBefore
						? vertex[xOrY] > startingVertex[xOrY]
						: vertex[xOrY] < startingVertex[xOrY]
				)
			));
		const sortedVerticies = validVerticies
			.sort((a, b) => a[xOrY] - b[xOrY]);
	
		return sortedVerticies[isNextInsteadOfBefore ? 0 : sortedVerticies.length - 1] ?? null;
	}

	function render() {
		if (!columnsNumber
			|| !rowsNumber) {
			gridCSS = [];
			return;
		}

		if (currentRenderedColumnsNumber === columnsNumber
			&& currentRenderedRowsNumber === rowsNumber) {
			return;
		}

		const { matrix, matrixIndexes } = getRandomCoordinateMatrix(columnsNumber, rowsNumber);
		randomCoordinateMatrix = matrix;
		randomCoordinateMatrixIndexes = matrixIndexes;

		// console.log('randomCoordinateMatrixIndexes:', randomCoordinateMatrixIndexes);
		randomCoordinateMatrixIndexes.forEach((randomCoordinateMatrixIndex, i) => {
			const maximumAndMinimumCoordinate = getMaximumAndMinimumCoordinate(randomCoordinateMatrixIndex);
			const grid = {
				column: `${
					maximumAndMinimumCoordinate.x.minimum
					+ 1
				} / span ${
					maximumAndMinimumCoordinate.x.maximum
					- maximumAndMinimumCoordinate.x.minimum
					+ 1
				}`,
				row: `${
					maximumAndMinimumCoordinate.y.minimum
					+ 1
				} / span ${
					maximumAndMinimumCoordinate.y.maximum
					- maximumAndMinimumCoordinate.y.minimum
					+ 1
				}`,
			};
			/** @typedef {[number, number]} vertex */
			/** @type {Set<vertex>} */
			const rawPolygon = [];
			const totalWidth = maximumAndMinimumCoordinate.x.maximum
				- maximumAndMinimumCoordinate.x.minimum
				+ 1;
			const totalHeight = maximumAndMinimumCoordinate.y.maximum
				- maximumAndMinimumCoordinate.y.minimum
				+ 1;
			const unitWidth = 1;
			const unitHeight = 1;

			randomCoordinateMatrixIndex.forEach(([x, y]) => {
				const xRelative = x - maximumAndMinimumCoordinate.x.minimum;
				const yRelative = y - maximumAndMinimumCoordinate.y.minimum;

				rawPolygon.push(`${fromDecimalToPercent((xRelative) / totalWidth)} ${fromDecimalToPercent((yRelative) / totalHeight)}`);
				rawPolygon.push(`${fromDecimalToPercent((xRelative) / totalWidth)} ${fromDecimalToPercent((yRelative + unitHeight) / totalHeight)}`);
				rawPolygon.push(`${fromDecimalToPercent((xRelative + unitWidth) / totalWidth)} ${fromDecimalToPercent((yRelative + unitHeight) / totalHeight)}`);
				rawPolygon.push(`${fromDecimalToPercent((xRelative + unitWidth) / totalWidth)} ${fromDecimalToPercent((yRelative) / totalHeight)}`);
			});

			const filteredPolygon = (() => {
				const seen = {};
				const out = [];
				let iii = 0;
				for (let ii = 0, l = rawPolygon.length; ii < l; ii++) {
					const item = rawPolygon[ii];
					// console.log(seen[item]);

					if (seen[item] === undefined) {
						seen[item] = 1;
						out[iii++] = item;

						continue;
					}

					seen[item] += 1;

					if (seen[item] >= 4) {
						// console.log(out.splice(out.indexOf(item), 1));
						--iii;
					}
				}
				return out;
			})();
			const polygonVerticiesString = Array.from(filteredPolygon);
			/** @type vertex[] */
			const polygonVerticies = polygonVerticiesString
				.map(
					(vertex) => vertex
						?.split(' ')
						.map(
							(vertexPart) => fromPercentToDecimal(vertexPart),
						),
				);
			const arrangedPolygonVerticies = hull(polygonVerticies, 0.7);
			const arrangedPolygonVerticiesString = arrangedPolygonVerticies.map(
				(vertex) => vertex
					.map(
						(vertexPart) => fromDecimalToPercent(vertexPart),
					)
					.join(' '),
			);

			gridCSS.splice(randomCoordinateMatrixIndexes.length, gridCSS.length);
			clipPathCSS.splice(randomCoordinateMatrixIndexes.length, clipPathCSS.length);
			zIndexCSS.splice(randomCoordinateMatrixIndexes.length, zIndexCSS.length);

			gridCSS[i] = `grid-column: ${grid.column}; grid-row: ${grid.row}`;
			clipPathCSS[i] = `clip-path: polygon(${arrangedPolygonVerticiesString})`;
			zIndexCSS[i] = `z-index: ${
				Math.floor(
					(
						maximumAndMinimumCoordinate.x.minimum
							- maximumAndMinimumCoordinate.x.maximum
						+ maximumAndMinimumCoordinate.y.minimum
							- maximumAndMinimumCoordinate.y.maximum
					) * 2,
				) + 20
			}`;

			currentRenderedColumnsNumber = columnsNumber;
			currentRenderedRowsNumber = rowsNumber;
		});

		// console.log(gridCSS, clipPathCSS);
	}
</script>

<component 
	bind:this={componentDomContent}
	style='
		--grid-template-rows: repeat({rowsNumber}, 1fr); 
		--grid-template-columns: repeat({columnsNumber}, 1fr);
	'>
	{#each gridCSS as _, i}
		<container style='
			{zIndexCSS[i]};
			{gridCSS[i]};
			{clipPathCSS[i]};
		'>
			<svelte:component
				this={getRandomCollageMaterial()}
			></svelte:component>
		</container>
	{/each}
</component>

<style>
	component {
		display: grid;
		width: 100%;
		height: 100%;

		user-select: none;

		grid-template-columns: var(--grid-template-columns);
		grid-template-rows: var(--grid-template-rows);
	}
</style>