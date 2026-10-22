Before: Druid projectile effects are drawn at a fixed spot and always fly one way. Cutting Wind's blade shows up to the left of the enemy and never comes from the Druid. Shooting Feather, Pinion Shot, Quill Spear and Sharpen Gust always fly right, and Roaring Piercer always flies left, whichever side the target is on. Low Flight's raptor always sweeps in from the right. Sharpen Hail's shot lands on the caster.

After: each of these starts at the caster and flies at the target, on whichever side of the caster the target is, and keeps doing so as the camera turns. Sharpen Hail lands on the target with the hail.

kRO's newer STR files lay the art out flying in one direction from its origin. StrEffect gets an opt-in `rotateToTarget` option, with `facing` giving the direction the art flies in the file. An effect with it turns its layout so the art points at the other entity on screen. Effects without the option draw exactly as before.

How: `getAimAngle()` projects the caster-to-target offset through the frame's model view and returns the turn. `renderAnimation` turns each layer's position about the art's centre (320, 240) and subtracts the same turn from `uSpriteAngle`, so this works with the GPU-rotation quad. The Druid rows in `EffectTable.js` and `SkillEffect.js` set the option, and some are moved from the target to the caster. `tests/renderer/StrEffectAim.test.js` covers the angle.

The Druid effect table these rows belong to is Lil Art's (27bcca2e), so this is for this fork rather than MrAntares.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
