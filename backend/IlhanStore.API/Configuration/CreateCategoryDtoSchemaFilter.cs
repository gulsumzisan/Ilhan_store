using IlhanStore.Business.DTOs.Category;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace IlhanStore.API.Configuration;

public class CreateCategoryDtoSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type != typeof(CreateCategoryDto))
            return;

        schema.Example = new OpenApiObject
        {
            ["name"] = new OpenApiString("Elbise"),
            ["description"] = new OpenApiString("Elbise kategorisi"),
            ["imageUrl"] = new OpenApiNull(),
            ["parentCategoryId"] = new OpenApiNull()
        };

        if (schema.Properties.TryGetValue("parentCategoryId", out var parentProperty))
        {
            parentProperty.Nullable = true;
            parentProperty.Description = "Opsiyonel. Ana kategori için null bırakın.";
        }
    }
}
