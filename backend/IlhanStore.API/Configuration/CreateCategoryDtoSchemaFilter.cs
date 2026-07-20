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
            ["isMainCategory"] = new OpenApiBoolean(true),
            ["parentCategoryIds"] = new OpenApiArray()
        };

        if (schema.Properties.TryGetValue("parentCategoryIds", out var parentProperty))
        {
            parentProperty.Description = "Opsiyonel. Birden fazla üst kategori atanabilir. Ana kategori için boş bırakın.";
        }

        if (schema.Properties.TryGetValue("isMainCategory", out var mainProperty))
        {
            mainProperty.Description = "True ise kategori üst menüde görünür.";
        }
    }
}
