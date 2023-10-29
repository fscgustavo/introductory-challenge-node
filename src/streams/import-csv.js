import { createReadStream } from "node:fs";
import { parse } from "csv-parse";

const taskListPath = new URL("./tasks.csv", import.meta.url);

const csvParse = parse({
	delimiter: ",",
	skipEmptyLines: true,
	fromLine: 2,
});

(async () => {
	const parser = createReadStream(taskListPath).pipe(csvParse);

	for await (const record of parser) {
		const [title, description] = record;

		await fetch("http://localhost:3333/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description,
			}),
		});
	}
})();
