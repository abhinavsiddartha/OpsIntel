for fname in ['intelligence/page.tsx', 'inventory/page.tsx', 'sales/page.tsx']:
    p = 'apps/web/src/app/' + fname
    with open(p, 'rb') as f:
        data = f.read()
    data = data.replace(b'\\"', b'"')
    with open(p, 'wb') as f:
        f.write(data)
    print('Cleaned', fname)
