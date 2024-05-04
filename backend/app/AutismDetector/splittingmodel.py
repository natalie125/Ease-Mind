import os

def split_file(file_path, chunk_size_mb=100, output_folder='chunks/'):
    """Split a file into multiple chunks."""
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    file_size = os.path.getsize(file_path)
    chunk_size = chunk_size_mb * 1024 * 1024  # Convert MB to bytes
    chunk_num = 0
    with open(file_path, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            chunk_num += 1
            chunk_name = os.path.join(output_folder, f'eye-tracking-model{chunk_num}.joblib')
            with open(chunk_name, 'wb') as chunk_file:
                chunk_file.write(chunk)
            print(f'Chunk {chunk_num} created: {chunk_name}')
    return chunk_num

def split_file_scalar(file_path, chunk_size_mb=100, output_folder='chunks-scaler/'):
    """Split a file into multiple chunks."""
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    file_size = os.path.getsize(file_path)
    chunk_size = chunk_size_mb * 1024 * 1024  # Convert MB to bytes
    chunk_num = 0
    with open(file_path, 'rb') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            chunk_num += 1
            chunk_name = os.path.join(output_folder, f'eye-tracking-scaler{chunk_num}.joblib')
            with open(chunk_name, 'wb') as chunk_file:
                chunk_file.write(chunk)
            print(f'Chunk {chunk_num} created: {chunk_name}')
    return chunk_num

# Example usage
model_path = 'eye-tracking-model.joblib'
num_chunks = split_file(model_path)
print(f"Model split into {num_chunks} parts.")

model_path = 'eye-tracking-scaler.joblib'
num_chunks = split_file_scalar(model_path)
print(f"Scaler split into {num_chunks} parts.")
