import codecs

def fix_app():
    with codecs.open('js/app.js', 'r', 'utf-8') as f:
        text = f.read()

    import re

    # DefaultServices
    text = re.sub(
        r"prices:\s*\{\s*iron:\s*([\d\.]+),\s*wash_iron:\s*([\d\.]+),\s*wash:\s*([\d\.]+)\s*\}",
        lambda m: f"prices: {{ iron: {m.group(1)}, wash_iron: {m.group(2)}, wash: {m.group(3)}, dry_clean: {m.group(1)}, steam: {m.group(1)} }}",
        text
    )
    text = re.sub(
        r"expressFee:\s*\{\s*iron:\s*([\d\.]+),\s*wash_iron:\s*([\d\.]+),\s*wash:\s*([\d\.]+)\s*\}",
        lambda m: f"expressFee: {{ iron: {m.group(1)}, wash_iron: {m.group(2)}, wash: {m.group(3)}, dry_clean: {m.group(1)}, steam: {m.group(1)} }}",
        text
    )

    # saveService Updates
    block1_find = r"const pWash = parseFloat\(document\.getElementById\('price-wash'\)\.value\);\s*const pExpFee = parseFloat\(document\.getElementById\('price-express-fee'\)\.value\);"
    block1_replace = r"const pWash = parseFloat(document.getElementById('price-wash').value);\r\n        const pExpFee = parseFloat(document.getElementById('price-express-fee').value);\r\n        const pDryClean = parseFloat(document.getElementById('price-dry-clean').value || 0);\r\n        const pSteam = parseFloat(document.getElementById('price-steam').value || 0);"
    text = re.sub(block1_find, block1_replace, text)

    block2_find = r"prices: \{ iron: pIron, wash_iron: pWashIron, wash: pWash \},"
    block2_replace = r"prices: { iron: pIron, wash_iron: pWashIron, wash: pWash, dry_clean: pDryClean, steam: pSteam },"
    text = re.sub(block2_find, block2_replace, text)

    # openServiceModal Updates
    block3_find = r"document\.getElementById\('price-wash'\)\.value = item\.prices\.wash;\s*document\.getElementById\('price-express-fee'\)\.value = typeof item\.expressFee === 'object'"
    block3_replace = "document.getElementById('price-wash').value = item.prices.wash;\r\n        document.getElementById('price-dry-clean').value = item.prices.dry_clean || 0;\r\n        document.getElementById('price-steam').value = item.prices.steam || 0;\r\n        document.getElementById('price-express-fee').value = typeof item.expressFee === 'object'"
    text = re.sub(block3_find, block3_replace, text)

    # setFastBatchType
    block4_find = r"\('#fb-type-wash_iron, #fb-type-iron, #fb-type-wash'\)\.forEach"
    block4_replace = r"('#fb-type-wash_iron, #fb-type-iron, #fb-type-wash, #fb-type-dry_clean, #fb-type-steam').forEach"
    text = re.sub(block4_find, block4_replace, text)

    # setModalType
    block5_find = r"\('#btn-type-iron, #btn-type-wash_iron, #btn-type-wash'\)\.forEach"
    block5_replace = r"('#btn-type-iron, #btn-type-wash_iron, #btn-type-wash, #btn-type-dry_clean, #btn-type-steam').forEach"
    text = re.sub(block5_find, block5_replace, text)

    # UI cart translations
    find6 = r"let tLbl = type === 'iron' \? 'كوي' : \(type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل'\);"
    rep6 = r"let tLbl = type === 'iron' ? 'كوي' : (type === 'wash_iron' ? 'غسيل وكوي' : (type === 'dry_clean' ? 'غسيل جاف' : (type === 'steam' ? 'بخار' : 'غسيل فقط')));"
    text = re.sub(find6, rep6, text)

    find7 = r"let tLbl = this\.currentLang === 'en'(.*?): \(item\.type === 'iron' \? 'كوي فقط' : \(item\.type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل فقط'\)\);"
    rep7 = r"""let tLbl = this.currentLang === 'en'\1: (item.type === 'iron' ? 'كوي فقط' : (item.type === 'wash_iron' ? 'غسيل وكوي' : (item.type === 'dry_clean' ? 'غسيل جاف' : (item.type === 'steam' ? 'بخار' : 'غسيل فقط'))));"""
    text = re.sub(find7, rep7, text, flags=re.DOTALL)

    find8 = r"let tLbl = it\.type === 'iron' \? 'كوي' : \(it\.type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل فقط'\);"
    rep8 = r"let tLbl = it.type === 'iron' ? 'كوي' : (it.type === 'wash_iron' ? 'غسيل وكوي' : (it.type === 'dry_clean' ? 'غسيل جاف' : (it.type === 'steam' ? 'بخار' : 'غسيل فقط')));"
    text = re.sub(find8, rep8, text)

    with codecs.open('js/app.js', 'w', 'utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    fix_app()
    print('done')
