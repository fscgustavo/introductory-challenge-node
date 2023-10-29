import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (_, res) => {
			const tasks = database.select("tasks");

			return res.end(JSON.stringify(tasks));
		},
	},
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { title, description } = req.body;

			if (!title || !description) {
				return res.writeHead(400).end(
					JSON.stringify({
						message: "the title and description are required",
					})
				);
			}

			const task = {
				id: randomUUID(),
				title,
				description,
				created_at: new Date(),
				updated_at: null,
				completed_at: null,
			};

			database.insert("tasks", task);

			return res.writeHead(201).end();
		},
	},
	{
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const { title, description } = req.body;

			if (!title && !description) {
				return res.writeHead(400).end(
					JSON.stringify({
						message: "the title or the description are missing for the update",
					})
				);
			}

			const wasUpdated = database.update("tasks", id, { title, description });

			if (!wasUpdated) {
				return res.writeHead(404).end();
			}

			return res.writeHead(204).end();
		},
	},
	{
		method: "PATCH",
		path: buildRoutePath("/tasks/:id/complete"),
		handler: (req, res) => {
			const { id } = req.params;

			const wasUpdated = database.update("tasks", id, {
				completed_at: new Date(),
			});

			if (!wasUpdated) {
				return res.writeHead(404).end();
			}

			return res.writeHead(204).end();
		},
	},
	{
		method: "DELETE",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;

			const wasDeleted = database.delete("tasks", id);

			if (!wasDeleted) {
				return res.writeHead(404).end();
			}

			return res.writeHead(204).end();
		},
	},
];
