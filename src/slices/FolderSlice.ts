import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setLoading } from "./LoadingSlice";

export interface Folder {
  id: string;
  folderName: string;
  createdBy: string;
  createdOn: string;
}

export interface FoldersState {
  folders: Folder[];
  filteredFolders: Folder[]; // New state for filtered folders
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FoldersState = {
  folders: [],
  filteredFolders: [], 
  status: "idle",
  error: null,
};

export const fetchFolders = createAsyncThunk<Folder[], void, { rejectValue: string }>(
  'folders/fetchFolders',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${import.meta.env.VITE_URL}/folders`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Folder[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch folders');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchFoldersSearch = createAsyncThunk<Folder[], { search: string }, { rejectValue: string }>(
  'folders/fetchFoldersSearch',
  async ({ search }, { rejectWithValue,dispatch }) => {
    try {
      dispatch(setLoading(true));
      let url = `${import.meta.env.VITE_URL}/folders`;
      if (search) {
        url += `?folderName_like=${search}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Folder[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch folders');
    }finally{
      dispatch(setLoading(false));
    }
  }
);

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<Folder[]>) => {
      state.folders = action.payload;
      state.filteredFolders = action.payload;
    },
    addFolder: (state, action: PayloadAction<Folder>) => {
      state.folders.push(action.payload);
      state.filteredFolders.push(action.payload); 
    },
    removeFolder: (state, action: PayloadAction<string>) => {
      state.folders = state.folders.filter((eachFolder) => eachFolder.id !== action.payload);
      state.filteredFolders = state.filteredFolders.filter((eachFolder) => eachFolder.id !== action.payload); // Remove from filteredFolders
    },
    renameFolder: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      const folderToUpdate = state.folders.find((folder) => folder.id === id);
      if (folderToUpdate) {
        folderToUpdate.folderName = name;
        const filteredFolderToUpdate = state.filteredFolders.find((folder) => folder.id === id);
        if (filteredFolderToUpdate) {
          filteredFolderToUpdate.folderName = name; 
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFolders.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.status = 'succeeded';
        state.folders = action.payload;
        state.filteredFolders = action.payload; 
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchFoldersSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFoldersSearch.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.status = 'succeeded';
        state.filteredFolders = action.payload;
      })
      .addCase(fetchFoldersSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  }
});

export const { setFolders, addFolder, removeFolder, renameFolder } = foldersSlice.actions;
export default foldersSlice.reducer;
