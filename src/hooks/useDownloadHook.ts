import * as FileSystem from "expo-file-system";
import { useEffect } from "react";

import { db } from "@/src/db";
import { SelectDownload } from "@/src/db/schema";
import { deleteDownloadById, insertDownload } from "@/src/db/utils/download";

export const useDownloadHook = () => {
  const filesDir = FileSystem.documentDirectory + "appFiles/";

  const downloadRemoteFile = async ({
    url,
    ext,
    name,
  }: {
    url: string;
    ext?: string;
    name?: string;
  }): Promise<{
    uri: string;
    download: SelectDownload;
  } | null> => {
    try {
      let downloadResumable: FileSystem.DownloadResumable;
      let fileName: string;

      if (name) {
        fileName = name;
        const file = await FileSystem.getInfoAsync(filesDir + fileName);

        if (file.exists) {
          const download = await db.query.download.findFirst({
            where: (download, { eq }) => eq(download.fileName, fileName),
          });

          if (download) {
            return {
              uri: file.uri,
              download,
            };
          } else {
            const [newDownload] = await insertDownload({
              url: file.uri,
              fileName,
            });
            return {
              uri: file.uri,
              download: newDownload,
            };
          }
        } else {
          downloadResumable = FileSystem.createDownloadResumable(
            url,
            filesDir + fileName
          );
        }
      } else if (ext) {
        // generate timestamp
        const timestamp = new Date().getTime();

        // random number
        const randomNumber = Math.floor(Math.random() * 999999);

        fileName = `file-${timestamp}-${randomNumber}${ext}`;

        // get file extension
        downloadResumable = FileSystem.createDownloadResumable(
          url,
          filesDir + fileName
        );
      } else {
        throw new Error("No name or extension provided.");
      }

      const uri = await downloadResumable.downloadAsync();
      if (uri) {
        const [newDownload] = await insertDownload({
          url: uri.uri,
          fileName,
        });

        return {
          uri: uri.uri,
          download: newDownload,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error downloading file: ", error);
      return null;
    }
  };

  const cleanUpFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(filesDir);

      const downloads = await db.query.download.findMany({
        with: {
          reel: true,
        },
      });

      files.forEach(async (file) => {
        const isExist = downloads.find(
          (download) => file === download.fileName
        );

        if (!isExist) {
          await FileSystem.deleteAsync(filesDir + file);
        } else {
          if (!isExist.reel) {
            await FileSystem.deleteAsync(filesDir + file);
            await deleteDownloadById(isExist.localId);

            // remove from downloads
            const index = downloads.findIndex(
              (download) => download.localId === isExist.localId
            );
            if (index > -1) {
              downloads.splice(index, 1);
            }
          }
        }
      });

      downloads.forEach(async (download) => {
        if (download?.fileName && !files.includes(download.fileName)) {
          await deleteDownloadById(download.localId);
        }
      });
      console.log("useDownloadHook: Done Cleanup.");
    } catch (e) {
      console.log("useDownloadHook Error: ", e);
    }
  };

  const initializeDownloadHook = async () => {
    try {
      const files = await FileSystem.getInfoAsync(filesDir);
      if (!files.exists) {
        await FileSystem.makeDirectoryAsync(filesDir);
      }
      await cleanUpFiles();
    } catch (e) {
      console.log("useDownloadHook Error: ", e);
    }
  };

  useEffect(() => {
    initializeDownloadHook();
  }, []);

  return { downloadRemoteFile };
};
