async function setupDB() {
	const keys = ["tasks", "counts", "taskmaster"];
	const defaultValues = [
		{},
		{ users: {} },
		{
			users: {},
			startDate: new Date(),
			taskMasterCompleteCount: 0,
		},
	];

	for (let i = 0; i < keys.length; i++) {
		let value = await DBHandler.get(keys[i]);
		if (!value) {
			value = defaultValues[i];
		}
		await DBHandler.set(keys[i], value);
	}

	return;
}

DBHandler.open()
	.then(async () => {
		await setupDB();
	})
	.catch((error) => {
		console.error("Error opening database:", error);
	});

async function handleImportEvent() {
	try {
		const allData = await DBHandler.getAll();
		const jsonExport = JSON.stringify(allData, null, 2);
		console.log("Exported IndexedDB data as JSON:", jsonExport);
		// TODO: further development — send jsonExport back via WebSocket, save to file, etc.
		client.doAction("d7ed12e3-67ca-4c80-9764-f917b90b8a67", {
			logs: jsonExport,
		});
	} catch (e) {
		console.error("Error exporting data from IndexedDB:", e);
	}
}
