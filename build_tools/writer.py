import os

def write(filepath, content, mode='w'):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, mode, encoding='utf-8') as f:
        f.write(content)
    print(f'Wrote: {filepath}')
