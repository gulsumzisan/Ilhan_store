using FluentValidation;
using IlhanStore.Business.DTOs.Category;

namespace IlhanStore.Business.Validation;

public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
