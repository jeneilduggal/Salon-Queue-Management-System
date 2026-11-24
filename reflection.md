# Vibe Coding Reflection — StyleNYC Salon Queue Management System

## What the AI agent got wrong
During the refinement of the salon queue project, the AI-assisted changes drifted away from the supplied reference design. In particular, the colours and where they appeared in the interface did not consistently match the original ZIP/reference. The requested change was to rename the product to **StyleNYC**, not to redesign the visual theme.

## How I noticed it
I compared the updated site with the original reference screenshot and ZIP. The mismatch was visible in the colour palette and the placement of colours across the page. I pointed out that the original look needed to be preserved and that the requested branding change should not result in a new design.

## How I corrected the prompt
I clarified the instruction: use the code and design from the supplied ZIP as the source, change the product name to StyleNYC, and keep the original layout, colours, and colour placement unchanged. I also gave direct feedback when the generated result still differed from the reference, rather than accepting a visually different redesign.

## What I learned
- A vibe-coding request should distinguish between the parts that may change (the product name) and the parts that must remain unchanged (the supplied design and layout).
- Providing a reference ZIP and screenshot is useful, but the prompt should explicitly say which details are fixed.
- Comparing the generated result against the reference is an important verification step; a successful build or deployment does not by itself prove that the result matches the requirements.

