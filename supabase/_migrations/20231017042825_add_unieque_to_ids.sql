CREATE UNIQUE INDEX "FormDefinition_id_for_edit_key" ON public."FormDefinition" USING btree (id_for_edit);

CREATE UNIQUE INDEX "FormDefinition_id_for_extention_key" ON public."FormDefinition" USING btree (id_for_extention);

CREATE UNIQUE INDEX "FormDefinition_id_for_view_key" ON public."FormDefinition" USING btree (id_for_view);


