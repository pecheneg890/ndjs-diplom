import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {
	async saveFiles(files: Express.Multer.File[], folderId: string): Promise<string[]> {
		const uploadFolder = `${path}/uploads/${folderId}`;
		await ensureDir(uploadFolder);

		const res: string[] = [];

		for (const file of files) {
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
			res.push(`/static/${folderId}/${file.originalname}`);
		}

		return res;
	}
}
