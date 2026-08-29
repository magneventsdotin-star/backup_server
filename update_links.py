import re
import urllib.parse

with open('booking-platform/app/components/home/SeoCardsSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

def get_category_from_title(title):
    title = title.lower()
    if 'band' in title:
        return 'Live band'
    if 'musician' in title:
        return 'Musician'
    if 'dj' in title:
        return 'Dj'
    if 'comedian' in title:
        return 'Comedian'
    return 'Singer'

def repl(match):
    title = match.group(1)
    link = match.group(2)
    rest = match.group(3)
    
    city = link.replace('/city/', '').replace('-', ' ').title()
    category = get_category_from_title(title)
    
    # URL encode the category and city
    cat_enc = urllib.parse.quote(category)
    city_enc = urllib.parse.quote(city)
    
    new_link = f'/artists?category={cat_enc}&city={city_enc}'
    return f'\"title\": \"{title}\",\n    \"link\": \"{new_link}\",\n{rest}'

new_content = re.sub(r'\"title\":\s*\"(.*?)\",\s*\n\s*\"link\":\s*\"(.*?)\",\s*\n(.*?\"type\":\s*\".*?\",\s*\n\s*\"subtext\":\s*\".*?\")', repl, content, flags=re.DOTALL)

with open('booking-platform/app/components/home/SeoCardsSection.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated successfully")
