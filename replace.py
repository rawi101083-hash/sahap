import codecs

def process_index_html():
    with codecs.open('index.html', 'r', 'utf-8') as f:
        content = f.read()

    # 1. Update Fast Batch Type Buttons
    fb_types_find = """<button class="btn-toggle" id="fb-type-wash"
                                onclick="appLogic.setFastBatchType('wash', this)">غسيل فقط</button>"""
    fb_types_replace = """<button class="btn-toggle" id="fb-type-wash" onclick="appLogic.setFastBatchType('wash', this)">غسيل فقط</button>
                            <button class="btn-toggle" id="fb-type-dry_clean" onclick="appLogic.setFastBatchType('dry_clean', this)">غسيل جاف</button>
                            <button class="btn-toggle" id="fb-type-steam" onclick="appLogic.setFastBatchType('steam', this)">بخار</button>"""
    # Just to be safe against spaces:
    import re
    
    # 1. Update Fast Batch Type Buttons
    content = re.sub(
        r'<button class="btn-toggle" id="fb-type-wash"\s*onclick="appLogic\.setFastBatchType\(\'wash\', this\)">غسيل فقط</button>',
        fb_types_replace, 
        content
    )

    # 2. Update Modal Details Type Buttons
    modal_types_replace = """<button class="btn-toggle" id="btn-type-wash" onclick="appLogic.setModalType('wash', this)">غسيل فقط</button>
                        <button class="btn-toggle" id="btn-type-dry_clean" onclick="appLogic.setModalType('dry_clean', this)">غسيل جاف</button>
                        <button class="btn-toggle" id="btn-type-steam" onclick="appLogic.setModalType('steam', this)">بخار</button>"""
    content = re.sub(
        r'<button class="btn-toggle" id="btn-type-wash" onclick="appLogic\.setModalType\(\'wash\', this\)">غسيل\s*فقط</button>',
        modal_types_replace,
        content
    )

    # 3. Add price fields
    price_fields_find = r'<input type="number" id="price-express-fee" value="0\.00" step="0\.5" class="w-100"\s*style="[^"]*"\s*dir="ltr">\s*</div>\s*</div>'
    price_fields_replace = r"""<input type="number" id="price-express-fee" value="0.00" step="0.5" class="w-100" style="padding:10px; background:var(--bg-body); border:1px solid var(--border); color:#fff; border-radius:var(--radius-sm);" dir="ltr">
                    </div>
                </div>

                <div class="pricing-grid" style="margin-bottom: 25px;">
                    <div class="form-group">
                        <label class="form-field-label">سعر الغسيل الجاف</label>
                        <input type="number" id="price-dry-clean" value="0.00" step="0.5" class="w-100" style="padding:10px; background:var(--bg-body); border:1px solid var(--border); color:#fff; border-radius:var(--radius-sm);" dir="ltr">
                    </div>
                    <div class="form-group">
                        <label class="form-field-label">سعر البخار</label>
                        <input type="number" id="price-steam" value="0.00" step="0.5" class="w-100" style="padding:10px; background:var(--bg-body); border:1px solid var(--border); color:#fff; border-radius:var(--radius-sm);" dir="ltr">
                    </div>
                </div>"""
    content = re.sub(price_fields_find, price_fields_replace, content)

    with codecs.open('index.html', 'w', 'utf-8') as f:
        f.write(content)


def process_app_js():
    with codecs.open('js/app.js', 'r', 'utf-8') as f:
        content = f.read()

    import re

    # 1. DefaultServices Additions
    # Replace the default prices dict with expanded ones
    content = re.sub(
        r"prices:\s*\{\s*iron:\s*([\d\.]+),\s*wash_iron:\s*([\d\.]+),\s*wash:\s*([\d\.]+)\s*\}",
        lambda m: f"prices: {{ iron: {m.group(1)}, wash_iron: {m.group(2)}, wash: {m.group(3)}, dry_clean: {m.group(1)}, steam: {m.group(1)} }}",
        content
    )
    content = re.sub(
        r"expressFee:\s*\{\s*iron:\s*([\d\.]+),\s*wash_iron:\s*([\d\.]+),\s*wash:\s*([\d\.]+)\s*\}",
        lambda m: f"expressFee: {{ iron: {m.group(1)}, wash_iron: {m.group(2)}, wash: {m.group(3)}, dry_clean: {m.group(1)}, steam: {m.group(1)} }}",
        content
    )

    # 2. saveService Updates
    # find lines reading price-wash-iron, etc.
    block1_find = r"const pWash = parseFloat\(document\.getElementById\('price-wash'\)\.value\);\s*const pExpFee = parseFloat\(document\.getElementById\('price-express-fee'\)\.value\);"
    block1_replace = r"const pWash = parseFloat(document.getElementById('price-wash').value);\n        const pExpFee = parseFloat(document.getElementById('price-express-fee').value);\n        const pDryClean = parseFloat(document.getElementById('price-dry-clean').value || 0);\n        const pSteam = parseFloat(document.getElementById('price-steam').value || 0);"
    content = re.sub(block1_find, block1_replace, content)

    block2_find = r"prices: \{ iron: pIron, wash_iron: pWashIron, wash: pWash \},"
    block2_replace = r"prices: { iron: pIron, wash_iron: pWashIron, wash: pWash, dry_clean: pDryClean, steam: pSteam },"
    content = re.sub(block2_find, block2_replace, content)

    # 3. openServiceModal Updates
    # find document.getElementById('price-wash-iron').value = item.prices.wash_iron...
    block3_find = r"document\.getElementById\('price-wash'\)\.value = item\.prices\.wash;\s*document\.getElementById\('price-express-fee'\)\.value = typeof item\.expressFee === 'object'"
    block3_replace = "document.getElementById('price-wash').value = item.prices.wash;\n        document.getElementById('price-dry-clean').value = item.prices.dry_clean || 0;\n        document.getElementById('price-steam').value = item.prices.steam || 0;\n        document.getElementById('price-express-fee').value = typeof item.expressFee === 'object'"
    content = re.sub(block3_find, block3_replace, content)

    # 4. setFastBatchType
    block4_find = r"\('#fb-type-wash_iron, #fb-type-iron, #fb-type-wash'\)\.forEach"
    block4_replace = r"('#fb-type-wash_iron, #fb-type-iron, #fb-type-wash, #fb-type-dry_clean, #fb-type-steam').forEach"
    content = re.sub(block4_find, block4_replace, content)

    # 5. setModalType
    block5_find = r"\('#btn-type-iron, #btn-type-wash_iron, #btn-type-wash'\)\.forEach"
    block5_replace = r"('#btn-type-iron, #btn-type-wash_iron, #btn-type-wash, #btn-type-dry_clean, #btn-type-steam').forEach"
    content = re.sub(block5_find, block5_replace, content)

    # 6. fastAddToCart message (Optional, if tLbl logic exists)
    content = re.sub(
        r"let tLbl = type === 'iron' \? 'كوي' : \(type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل'\);",
        r"let tLbl = type === 'iron' ? 'كوي' : (type === 'wash_iron' ? 'غسيل وكوي' : (type === 'dry_clean' ? 'غسيل جاف' : (type === 'steam' ? 'بخار' : 'غسيل فقط')));",
        content
    )

    # 7. updateCartUI translations
    content = re.sub(
        r"let tLbl = this\.currentLang === 'en'\s*\n\s*\? \(item\.type === 'iron' \? 'Iron Only' : \(item\.type === 'wash_iron' \? 'Wash & Iron' : 'Wash Only'\)\)\s*\n\s*: \(item\.type === 'iron' \? 'كوي فقط' : \(item\.type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل فقط'\)\);",
        r"""let tLbl = this.currentLang === 'en'
                    ? (item.type === 'iron' ? 'Iron Only' : (item.type === 'wash_iron' ? 'Wash & Iron' : (item.type === 'dry_clean' ? 'Dry Clean' : (item.type === 'steam' ? 'Steam' : 'Wash Only'))))
                    : (item.type === 'iron' ? 'كوي فقط' : (item.type === 'wash_iron' ? 'غسيل وكوي' : (item.type === 'dry_clean' ? 'غسيل جاف' : (item.type === 'steam' ? 'بخار' : 'غسيل فقط'))));""",
        content
    )

    # 8. downloadDigitalPDF translations
    content = re.sub(
        r"let tLbl = it\.type === 'iron' \? 'كوي' : \(it\.type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل فقط'\);",
        r"let tLbl = it.type === 'iron' ? 'كوي' : (it.type === 'wash_iron' ? 'غسيل وكوي' : (it.type === 'dry_clean' ? 'غسيل جاف' : (it.type === 'steam' ? 'بخار' : 'غسيل فقط')));",
        content
    )

    # 9. generateThermalHTML translations
    content = re.sub(
        r"let tLbl = it\.type === 'iron' \? 'كوي' : \(it\.type === 'wash_iron' \? 'غسيل وكوي' : 'غسيل فقط'\);",
        r"let tLbl = it.type === 'iron' ? 'كوي' : (it.type === 'wash_iron' ? 'غسيل وكوي' : (it.type === 'dry_clean' ? 'غسيل جاف' : (it.type === 'steam' ? 'بخار' : 'غسيل فقط')));",
        content
    )

    with codecs.open('js/app.js', 'w', 'utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    process_index_html()
    process_app_js()
    print("Done")
