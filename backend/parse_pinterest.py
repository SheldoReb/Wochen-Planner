import json
import requests
from bs4 import BeautifulSoup

def extract_recipe_names(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        pins = json.load(file)
    
    new_list = []
    
    for pin in pins:
        url = pin.get('url', '')
        name = "No title"
        image = "No image"
        
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract title
            title_tag = soup.find('title')
            if title_tag:
                name = title_tag.text.split('|')[0].strip()
            
            # Extract image URL from OpenGraph meta tag
            og_image = soup.find('meta', property='og:image')
            if og_image and og_image.get('content'):
                image = og_image.get('content').strip()
        except Exception:
            pass
        
        new_entry = {
            "name": name,
            "url": url,
            "cuisine": "pinterest",
            "image": image
        }
        new_list.append(new_entry)
    
    return new_list

# Example usage
if __name__ == "__main__":
    result = extract_recipe_names('pinterest/pins_data_2.json')
    with open('parsed_pins.json', 'w', encoding='utf-8') as outfile:
        json.dump(result, outfile, ensure_ascii=False, indent=4)