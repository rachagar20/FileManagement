import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from './LoadingSlice';

export interface Document {
  id: string;
  documentName: string;
  documents: string;
  folderId: string;
  uploadedBy: string;
  uploadedOn: string;
  url: string;
}

export interface DocumentsState {
  documents: Document[];
  filteredDocuments: Document[]; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  filteredDocuments: [], 
  status: 'idle',
  error: null,
};

export const fetchDocuments = createAsyncThunk<Document[], void, { rejectValue: string }>(
  'documents/fetchDocuments',
  async (_, { rejectWithValue,dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${import.meta.env.VITE_URL}/documents`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Document[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch documents');
    }finally{
      dispatch(setLoading(false))
    }
  }
);

export const fetchDocumentsSearch = createAsyncThunk<Document[], { search: string }, { rejectValue: string }>(
  'documents/fetchDocumentsSearch',
  async ({ search }, { rejectWithValue,dispatch }) => {
    try {
      dispatch(setLoading(true));
      let url = `${import.meta.env.VITE_URL}/documents`;
      if (search) {
        url += `?documentName_like=${search}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Document[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch documents');
    }finally{
      dispatch(setLoading(false));
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
      state.filteredDocuments.push(action.payload)
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
      state.filteredDocuments=state.filteredDocuments.filter(doc=>doc.id!==action.payload);
    },
    renameDocument: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const { id, name } = action.payload;
      const document = state.documents.find(eachDocument => eachDocument.id === id);
      if (document) {
        document.documentName = name;
        const filterDocument=state.filteredDocuments.find(eachDocument => eachDocument.id === id);
        if(filterDocument){
          filterDocument.documentName=name;
        }
      }
      
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocuments.fulfilled, (state, action: PayloadAction<Document[]>) => {
        state.status = 'succeeded';
        state.documents = action.payload;
        state.filteredDocuments = action.payload; 
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchDocumentsSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocumentsSearch.fulfilled, (state, action: PayloadAction<Document[]>) => {
        state.status = 'succeeded';
        state.filteredDocuments = action.payload; 
      })
      .addCase(fetchDocumentsSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addDocument, removeDocument, renameDocument, setError } = documentsSlice.actions;
export default documentsSlice.reducer;
